import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';;
import { Usuario } from 'src/usuario/usuario.entity';
import { Inventario } from 'src/inventario/inventario.entity';
import { Devolucion } from './entities/devolucion.entity';
import { Pedido } from 'src/pedidos/pedido.entity';
import { DetalleFactura } from 'src/detalle_factura/detalle_factura.entity';
import { CreateDevolucionDto } from './dto/create-devolucion.dto';
import { UpdateDevolucionDto } from './dto/update-devolucion.dto';

@Injectable()
export class DevolucionService {
  constructor(
    @InjectRepository(Devolucion)
    private readonly devolucionRepo: Repository<Devolucion>,
    @InjectRepository(Pedido)
    private readonly pedidoRepo: Repository<Pedido>,
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
    @InjectRepository(DetalleFactura)
    private readonly detalleRepo: Repository<DetalleFactura>,
    @InjectRepository(Inventario)
    private readonly inventarioRepo: Repository<Inventario>,
  ) {}

  async crearDevolucion(dto: CreateDevolucionDto): Promise<Devolucion> {
    const pedido = await this.pedidoRepo.findOne({ where: { id_pedido: dto.id_pedido } });
    if (!pedido) throw new NotFoundException('Pedido no encontrado');

    const usuario = await this.usuarioRepo.findOne({ where: { id_usuario: dto.id_usuario } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    let inventario: Inventario | null = null;
    if (dto.id_inventario) {
      inventario = await this.inventarioRepo.findOne({ where: { id_inventario: dto.id_inventario } });
      if (!inventario) throw new NotFoundException('Inventario no encontrado');
    }

    const devolucion = this.devolucionRepo.create({
      pedido,
      usuario,
      inventario,
      cantidad: dto.cantidad,
      motivo: dto.motivo,
      monto_reembolsado: dto.monto_reembolsado != null ? dto.monto_reembolsado.toFixed(2) : '0',
    });

    return this.devolucionRepo.save(devolucion);
  }

  async obtenerTodasLasDevoluciones(): Promise<Devolucion[]> {
    return this.devolucionRepo.find();
  }

  async obtenerPorId(id: number): Promise<Devolucion> {
    const dev = await this.devolucionRepo.findOne({
      where: { id_devolucion: id }
    });
    if (!dev) throw new NotFoundException('Devolución no encontrada');
    return dev;
  }

  async findAllByUserId(userId: number) {
    const user = await this.usuarioRepo.findOne({ where: { id_usuario: userId }});
    if (!user) {
      return [];
    }
    return this.devolucionRepo.find({ where: { usuario: user } });
  }

  async actualizarPorId(id: number, dto: UpdateDevolucionDto): Promise<Devolucion> {
    const dev = await this.obtenerPorId(id);

    if (dto.id_pedido) {
      const pedido = await this.pedidoRepo.findOne({ where: { id_pedido: dto.id_pedido } });
      if (!pedido) throw new NotFoundException('Pedido no encontrado');
      dev.pedido = pedido;
    }

    if (dto.id_usuario) {
      const usuario = await this.usuarioRepo.findOne({ where: { id_usuario: dto.id_usuario } });
      if (!usuario) throw new NotFoundException('Usuario no encontrado');
      dev.usuario = usuario;
    }



    if (dto.id_inventario !== undefined) {
      dev.inventario = dto.id_inventario ? await this.inventarioRepo.findOne({ where: { id_inventario: dto.id_inventario } }) : null;
      if (dto.id_inventario && !dev.inventario) throw new NotFoundException('Inventario no encontrado');
    }

    if (dto.cantidad !== undefined) dev.cantidad = dto.cantidad;
    if (dto.motivo !== undefined) dev.motivo = dto.motivo;
    if (dto.monto_reembolsado !== undefined) dev.monto_reembolsado = dto.monto_reembolsado.toFixed(2);

    return this.devolucionRepo.save(dev);
  }

  async eliminarPorId(id: number): Promise<void> {
    const dev = await this.obtenerPorId(id);
    await this.devolucionRepo.remove(dev);
  }
}
