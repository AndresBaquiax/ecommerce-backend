import { Injectable, NotFoundException } from '@nestjs/common';
import { GoogleDriveService } from './google-drive.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Producto } from './productos.entity';
import { Oferta } from 'src/ofertas/oferta.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private productosRepository: Repository<Producto>,
    @InjectRepository(Oferta)
    private ofertasRepository: Repository<Oferta>,
    private readonly googleDriveService?: GoogleDriveService,
  ) {}

  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    const producto = this.productosRepository.create({
      ...createProductoDto,
      estado: true
    });
    return this.productosRepository.save(producto);
  }

  private async aplicarOferta(producto: any): Promise<any> {
    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0); // Normalizar a medianoche para comparación

    const oferta = await this.ofertasRepository.findOne({
      where: {
        id_producto: producto.id_producto,
        fecha_inicio: LessThanOrEqual(fechaActual),
        fecha_fin: MoreThanOrEqual(fechaActual),
      },
    });

    if (oferta && oferta.descuento_porcentaje) {
      const precioConDescuento = Number(producto.precio_unitario) * (1 - Number(oferta.descuento_porcentaje) / 100);
      return {
        ...producto,
        precio_unitario: Number(precioConDescuento.toFixed(2)),
        precio_original: Number(producto.precio_unitario),
        tiene_oferta: true,
        descuento_porcentaje: Number(oferta.descuento_porcentaje),
      };
    }

    return producto;
  }

  async findAll(): Promise<any[]> {
    const productos = await this.productosRepository.find({
      where: { estado: true },
      relations: ['categoria']
    });
    
    const productosConOfertas = await Promise.all(
      productos.map(async (producto) => {
        const { categoria, ...productoSinCategoria } = producto;
        const productoBase = {
          ...productoSinCategoria,
          nombre_categoria: categoria?.nombre || null
        };
        return await this.aplicarOferta(productoBase);
      })
    );

    return productosConOfertas;
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
    const productoBase = {
      ...productoSinCategoria,
      nombre_categoria: categoria?.nombre || null
    };
    return await this.aplicarOferta(productoBase);
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
