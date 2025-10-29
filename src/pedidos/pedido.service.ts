import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, Repository } from 'typeorm';
import { Pedido } from './pedido.entity';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';

@Injectable()
export class PedidoService {
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepo: Repository<Pedido>,
  ) {}

  create(dto: CreatePedidoDto) {
    const pedido = this.pedidoRepo.create(dto);
    return this.pedidoRepo.save(pedido);
  }

  findAll() {
    return this.pedidoRepo.find();
  }

  findOne(id: number) {
    return this.pedidoRepo.findOneBy({ id_pedido: id });
  }

  async update(id: number, dto: UpdatePedidoDto) {
    const pedido = await this.pedidoRepo.preload({
      id_pedido: id,
      ...dto,
    });
    if (!pedido) throw new NotFoundException('Pedido no encontrado');
    return this.pedidoRepo.save(pedido);
  }

  async remove(id: number) {
    const pedido = await this.findOne(id);
    if (!pedido) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }
    return this.pedidoRepo.remove(pedido);
  }

  async buscarPedidos(filtros: {
    estado?: boolean;
    id_usuario?: number;
    desde?: string;
    hasta?: string;
  }) {
    const where: FindOptionsWhere<Pedido> = {};

    if (filtros.estado !== undefined) {
      where.estado = filtros.estado;
    }

    if (filtros.id_usuario) {
      where.id_usuario = filtros.id_usuario;
    }

    if (filtros.desde && filtros.hasta) {
      where.fecha_pedido = Between(filtros.desde, filtros.hasta);
    }

    return this.pedidoRepo.find({ where });
  }
}
