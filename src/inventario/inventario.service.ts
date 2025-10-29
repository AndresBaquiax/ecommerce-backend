import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventario } from './inventario.entity';
import { CreateInventarioDto } from './dto/crear-inventario.dto';
import { UpdateInventarioDto } from './dto/actualizar-inventario.dto';
import { Producto } from 'src/productos/productos.entity';

@Injectable()
export class InventarioService {
  constructor(
    @InjectRepository(Inventario)
    private inventarioRepo: Repository<Inventario>,
    @InjectRepository(Producto)
    private productoRepo: Repository<Producto>,
  ) {}

  async crear(dto: CreateInventarioDto): Promise<Inventario> {
    const producto = await this.productoRepo.findOne({
      where: { id_producto: dto.id_producto },
    });
    if (!producto) throw new NotFoundException('Producto no encontrado');

    const inventario = this.inventarioRepo.create({
      cantidad: dto.cantidad,
      estado: dto.estado,
      producto,
    });

    return this.inventarioRepo.save(inventario);
  }

  async obtenerTodos(): Promise<Inventario[]> {
    return this.inventarioRepo.find({
      relations: ['producto'],
      order: { id_inventario: 'DESC' },
    });
  }

  async obtenerPorId(id: number): Promise<Inventario> {
    const inventario = await this.inventarioRepo.findOne({
      where: { id_inventario: id },
      relations: ['producto'],
    });
    if (!inventario) throw new NotFoundException('Inventario no encontrado');
    return inventario;
  }

  async actualizar(id: number, dto: UpdateInventarioDto): Promise<Inventario> {
    const inventario = await this.obtenerPorId(id);

    if (dto.cantidad !== undefined) inventario.cantidad = dto.cantidad;
    if (dto.estado !== undefined) inventario.estado = dto.estado;

    if (dto.id_producto) {
      const producto = await this.productoRepo.findOne({
        where: { id_producto: dto.id_producto },
      });
      if (!producto) throw new NotFoundException('Producto no encontrado');
      inventario.producto = producto;
    }

    return this.inventarioRepo.save(inventario);
  }

  async eliminarLogico(id: number): Promise<Inventario> {
    const inventario = await this.inventarioRepo.findOneBy({ id_inventario: id });
    if (!inventario) throw new NotFoundException('Inventario no encontrado');

    inventario.estado = false;
    return this.inventarioRepo.save(inventario);
  }

  async obtenerCantidadPorProducto(id_producto: number): Promise<{ cantidad: number }> {
    const inventario = await this.inventarioRepo.findOne({
      where: { 
        id_producto: id_producto,
        estado: true 
      },
    });
    
    if (!inventario) {
      throw new NotFoundException('No se encontró inventario para este producto');
    }

    return { cantidad: inventario.cantidad };
  }
}
