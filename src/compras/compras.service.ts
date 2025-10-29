import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Factura } from 'src/factura/factura.entity';
import { DetalleFactura } from 'src/detalle_factura/detalle_factura.entity';
import { Inventario } from 'src/inventario/inventario.entity';
import { Lotes } from 'src/lotes/lotes.entity';
import { AsignacionLotes } from 'src/asignacion-lotes/asignacion-lotes.entity';
import { Proveedor } from 'src/proveedor/proveedor.entity';
import { Usuario } from 'src/usuario/usuario.entity';
import { RegistrarCompraDto } from './dto/registrar-compra.dto';
import { Usuarios } from 'src/usuarios/usuarios.entity';

@Injectable()
export class ComprasService {
  constructor(
    private dataSource: DataSource,

    @InjectRepository(Factura)
    private readonly facturaRepo: Repository<Factura>,

    @InjectRepository(DetalleFactura)
    private readonly detalleFacturaRepo: Repository<DetalleFactura>,

    @InjectRepository(Inventario)
    private readonly inventarioRepo: Repository<Inventario>,

    @InjectRepository(Lotes)
    private readonly loteRepo: Repository<Lotes>,

    @InjectRepository(AsignacionLotes)
    private readonly asignacionLotesRepo: Repository<AsignacionLotes>,

    @InjectRepository(Proveedor)
    private readonly proveedorRepo: Repository<Proveedor>,

    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,

    @InjectRepository(Usuarios)
    private readonly usuariosRepo: Repository<Usuarios>,
  ) {}

  async registrarCompra(
    dto: RegistrarCompraDto,
    id_usuario: number,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const proveedor = await queryRunner.manager.findOne(Proveedor, {
        where: { id_proveedor: dto.id_proveedor },
      });
      if (!proveedor) {
        throw new NotFoundException('Proveedor no encontrado');
      }

      const usuario = await queryRunner.manager.findOne(Usuario, {
        where: { id_usuario: id_usuario },
      });
      if (!usuario) {
        throw new UnauthorizedException('Usuario no válido');
      }

      const nuevaFactura = queryRunner.manager.create(Factura, {
        tipo: 'Compra',
        fecha: dto.fecha as any,
        subtotal: dto.subtotal.toFixed(2),
        total: dto.total.toFixed(2),
        descuento: dto.descuento ? dto.descuento.toFixed(2) : null,
        estado: true,
        proveedor,
      });
      await queryRunner.manager.save(Factura, nuevaFactura);

      const relacion = queryRunner.manager.create(Usuarios, {
        usuario,
        factura: nuevaFactura,
      });
      await queryRunner.manager.save(Usuarios, relacion);

      for (const item of dto.detalleProductos) {
        const inventario = await queryRunner.manager.findOne(Inventario, {
          where: { id_inventario: item.id_inventario },
          relations: ['producto'],
        });
        if (!inventario) {
          throw new NotFoundException(`Inventario con ID ${item.id_inventario} no encontrado`);
        }

        const lote = queryRunner.manager.create(Lotes, {
          fecha_vencimiento: item.fecha_vencimiento,
          cantidad: item.cantidad,
          estado: true,
        });
        const loteGuardado = await queryRunner.manager.save(Lotes, lote);

        const asignacion = queryRunner.manager.create(AsignacionLotes, {
          inventario,
          lote: loteGuardado,
          estado: true,
        });
        await queryRunner.manager.save(AsignacionLotes, asignacion);

        const detalle = queryRunner.manager.create(DetalleFactura, {
          cantidad: item.cantidad,
          precio_unitario: Number(item.precio_unitario.toFixed(2)),
          factura: nuevaFactura,
          inventario,
          lote: loteGuardado,
        });
        await queryRunner.manager.save(DetalleFactura, detalle);

        inventario.cantidad += item.cantidad;
        await queryRunner.manager.save(Inventario, inventario);
      }

      await queryRunner.commitTransaction();
      return { mensaje: 'Compra registrada exitosamente' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

}