import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Factura } from 'src/factura/factura.entity';
import { DetalleFactura } from 'src/detalle_factura/detalle_factura.entity';
import { Inventario } from 'src/inventario/inventario.entity';
import { RegistrarVentaDto } from './dto/registrar-venta.dto';
import { Usuarios } from 'src/usuarios/usuarios.entity';
import { Usuario } from 'src/usuario/usuario.entity';
import { Pedido } from 'src/pedidos/pedido.entity';
import { Direccion } from 'src/direcciones/direccion.entity';
import { Lotes } from 'src/lotes/lotes.entity';

@Injectable()
export class VentasService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Factura)
    private readonly facturaRepo: Repository<Factura>,
    @InjectRepository(DetalleFactura)
    private readonly detalleRepo: Repository<DetalleFactura>,
    @InjectRepository(Inventario)
    private readonly inventarioRepo: Repository<Inventario>,
    @InjectRepository(Usuarios)
    private readonly usuariosRepo: Repository<Usuarios>,
    @InjectRepository(Pedido)
    private readonly pedidoRepo: Repository<Pedido>,
    @InjectRepository(Direccion)
    private readonly direccionRepo: Repository<Direccion>,
    @InjectRepository(Lotes)
    private readonly loteRepo: Repository<Lotes>,
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  async registrarVenta(dto: RegistrarVentaDto, id_usuario: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const direccion = await queryRunner.manager.findOne(Direccion, {
        where: { id_direccion: dto.id_direccion },
      });
      if (!direccion) throw new NotFoundException('Dirección no encontrada');

      const usuario = await queryRunner.manager.findOne(Usuario, {
        where: { id_usuario },
      });
      if (!usuario) throw new NotFoundException('Usuario no encontrado');

      const ids = dto.productos.map(p => p.id_inventario);

      const inventarios = await queryRunner.manager.find(Inventario, {
        where: ids.map(id => ({ id_inventario: id })),
        relations: ['producto'],
      });

      const inventariosMap = new Map<number, Inventario>();
      for (const inventario of inventarios) {
        inventariosMap.set(inventario.id_inventario, inventario);
      }

      for (const producto of dto.productos) {
        const inventario = inventariosMap.get(producto.id_inventario);
        if (!inventario) {
          throw new NotFoundException(`Inventario con ID ${producto.id_inventario} no encontrado`);
        }
        if (inventario.cantidad < producto.cantidad) {
          throw new NotFoundException(`No hay suficiente stock de ${inventario.producto?.nombre}`);
        }
      }

      const facturaEntity = new Factura();
      facturaEntity.tipo = dto.tipo;
      facturaEntity.fecha = new Date(dto.fecha);
      facturaEntity.estado = true;
      facturaEntity.proveedor = null as any;

      let subtotal = 0;
      let totalDescuento = 0;

      for (const producto of dto.productos) {
        const precioOriginal = producto.precio_unitario * producto.cantidad;
        let descuentoProducto = 0;

        if (producto.cantidad >= 20) {
          descuentoProducto = precioOriginal * 0.1;
        }

        subtotal += precioOriginal;
        totalDescuento += descuentoProducto;
      }

      const total = subtotal - totalDescuento;
      const costoEnvio = parseFloat((total * 0.05).toFixed(2));
      const totalFinal = total + costoEnvio;

      facturaEntity.subtotal = parseFloat(subtotal.toFixed(2)).toString();
      facturaEntity.total = parseFloat(totalFinal.toFixed(2)).toString();
      facturaEntity.descuento =
      totalDescuento > 0 ? parseFloat(totalDescuento.toFixed(2)).toString() : null;

      await queryRunner.manager.save(Factura, facturaEntity);

      const relacion = this.usuariosRepo.create({
        usuario,
        factura: facturaEntity,
      });
      await queryRunner.manager.save(Usuarios, relacion);

      for (const producto of dto.productos) {
        const inventario = inventariosMap.get(producto.id_inventario)!;

        const lotesDisponibles = await this.loteRepo
          .createQueryBuilder('lote')
          .innerJoin('asigna_lotes', 'asig', 'asig.id_lote = lote.id_lote AND asig.id_inventario = :idInventario', {
            idInventario: producto.id_inventario,
          })
          .where('lote.estado = true')
          .orderBy('lote.fecha_vencimiento', 'ASC')
          .getMany();

        let cantidadRestante = producto.cantidad;

        for (const lote of lotesDisponibles) {
          if (cantidadRestante <= 0) break;

          const cantidadUsar = Math.min(lote.cantidad, cantidadRestante);

          const detalle = this.detalleRepo.create({
            cantidad: cantidadUsar,
            precio_unitario: parseFloat(producto.precio_unitario.toFixed(2)),
            factura: facturaEntity,
            inventario,
            lote,
          });
          await queryRunner.manager.save(DetalleFactura, detalle);

          inventario.cantidad -= cantidadUsar;
          lote.cantidad -= cantidadUsar;

          if (lote.cantidad <= 0) {
            lote.estado = false;
          }

          await queryRunner.manager.save(Inventario, inventario);
          await queryRunner.manager.save(Lotes, lote);

          cantidadRestante -= cantidadUsar;
        }
      }

      const pedido = this.pedidoRepo.create({
        fecha_pedido: dto.fecha,
        direccion_envio: this.generarDireccionTexto(direccion),
        costo_envio: costoEnvio,
        subtotal: subtotal,
        total: totalFinal,
        estado: true,
        id_usuario: usuario.id_usuario,
        id_factura: facturaEntity.id_factura,
      });
      await queryRunner.manager.save(Pedido, pedido);

      await queryRunner.commitTransaction();
      return { mensaje: 'Venta registrada exitosamente', factura_id: facturaEntity.id_factura };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private generarDireccionTexto(direccion: Direccion): string {
    return `${direccion.calle}, ${direccion.colonia}, ${direccion.ciudad}`;
  }
}
