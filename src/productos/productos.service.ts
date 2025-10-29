import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './productos.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private productosRepository: Repository<Producto>,
  ) {}

  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    const producto = this.productosRepository.create({
      ...createProductoDto,
      estado: true
    });
    return this.productosRepository.save(producto);
  }

  async findAll(): Promise<any[]> {
    const productos = await this.productosRepository.find({
      where: { estado: true },
      relations: ['categoria']
    });
    
    return productos.map(producto => {
      const { categoria, ...productoSinCategoria } = producto;
      return {
        ...productoSinCategoria,
        nombre_categoria: categoria?.nombre || null
      };
    });
  }

  async findOne(id: number): Promise<any> {
    const producto = await this.productosRepository.findOne({
      where: { id_producto: id },
      relations: ['categoria']
    });
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    const { categoria, ...productoSinCategoria } = producto;
    return {
      ...productoSinCategoria,
      nombre_categoria: categoria?.nombre || null
    };
  }

  async update(id: number, updateProductoDto: UpdateProductoDto): Promise<Producto> {
    await this.findOne(id);
    await this.productosRepository.update(id, {
      ...updateProductoDto,
      estado: true
    });
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ "estado actual": boolean }> {
    const producto = await this.findOne(id);
    producto.estado = !producto.estado; // Alterna entre true/false
    await this.productosRepository.save(producto);
    return { "estado actual": producto.estado };
  }
}
