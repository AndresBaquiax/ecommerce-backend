import {Injectable,NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DetalleFactura } from './detalle_factura.entity';
import { CreateDetalleFacturaDto } from './dto/crear-detalle-factura.dto';
import { UpdateDetalleFacturaDto } from './dto/actualizar-detalle-factura.dto';
import { Factura } from 'src/factura/factura.entity';
import { Inventario } from 'src/inventario/inventario.entity';
import { Lotes } from 'src/lotes/lotes.entity';

@Injectable()
export class DetalleFacturaService {
  constructor(
    @InjectRepository(DetalleFactura)
    private readonly detalleRepo: Repository<DetalleFactura>,
    @InjectRepository(Factura)
    private readonly facturaRepo: Repository<Factura>,
    @InjectRepository(Inventario)
    private readonly inventarioRepo: Repository<Inventario>,
    @InjectRepository(Lotes)
    private readonly loteRepo: Repository<Lotes>,
  ) {}

  async crear(dto: CreateDetalleFacturaDto): Promise<DetalleFactura> {
    const factura = await this.facturaRepo.findOne({
      where: { id_factura: dto.id_factura },
    });
    if (!factura) throw new NotFoundException('Factura no encontrada');

    const inventario = await this.inventarioRepo.findOne({
      where: { id_inventario: dto.id_inventario },
    });
    if (!inventario) throw new NotFoundException('Inventario no encontrado');

    const lote = await this.loteRepo.findOne({
      where: { id_lote: dto.id_lote },
    });
    if (!lote) throw new NotFoundException('Lote no encontrado');

    const detalle = this.detalleRepo.create({
      cantidad: dto.cantidad,
      precio_unitario: parseFloat(dto.precio_unitario.toFixed(2)),
      factura,
      inventario,
      lote,
    });

    return this.detalleRepo.save(detalle);
  }

  async obtenerTodos(): Promise<DetalleFactura[]> {
    return this.detalleRepo.find({
      relations: ['factura', 'inventario', 'lote'],
      order: { id_detalle: 'DESC' },
    });
  }

  async obtenerPorId(id: number): Promise<DetalleFactura> {
    const detalle = await this.detalleRepo.findOne({
      where: { id_detalle: id },
      relations: ['factura', 'inventario', 'lote'],
    });
    if (!detalle) throw new NotFoundException('Detalle de factura no encontrado');
    return detalle;
  }

  async actualizar(id: number, dto: UpdateDetalleFacturaDto): Promise<DetalleFactura> {
    const detalle = await this.obtenerPorId(id);

    if (dto.id_factura) {
      const factura = await this.facturaRepo.findOne({
        where: { id_factura: dto.id_factura },
      });
      if (!factura) throw new NotFoundException('Factura no encontrada');
      detalle.factura = factura;
    }

    if (dto.id_inventario) {
      const inventario = await this.inventarioRepo.findOne({
        where: { id_inventario: dto.id_inventario },
      });
      if (!inventario) throw new NotFoundException('Inventario no encontrado');
      detalle.inventario = inventario;
    }

    if (dto.id_lote) {
      const lote = await this.loteRepo.findOne({
        where: { id_lote: dto.id_lote },
      });
      if (!lote) throw new NotFoundException('Lote no encontrado');
      detalle.lote = lote;
    }

    if (dto.cantidad !== undefined) detalle.cantidad = dto.cantidad;
    if (dto.precio_unitario !== undefined)
      detalle.precio_unitario = parseFloat(dto.precio_unitario.toFixed(2));

    return this.detalleRepo.save(detalle);
  }

  async eliminar(id: number): Promise<void> {
    const detalle = await this.obtenerPorId(id);
    await this.detalleRepo.remove(detalle);
  }
}
