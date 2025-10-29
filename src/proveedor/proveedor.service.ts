import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Proveedor } from './proveedor.entity';
import { Repository } from 'typeorm';
import {CreateProveedorDto} from './dto/crear-proveedor.dto'
import {UpdateProveedorDto} from './dto/actualizar-proveedor.dto'
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class ProveedorService {
  constructor(
    @InjectRepository(Proveedor)
    private readonly proveedorRepository: Repository<Proveedor>,
  ) {}

  async crear(dto: CreateProveedorDto): Promise<Proveedor> {
    const proveedor = this.proveedorRepository.create(dto);
    return this.proveedorRepository.save(proveedor);
  }

  async obtenerTodos(): Promise<Proveedor[]> {
    return this.proveedorRepository.find();
  }

  async obtenerPorId(id: number): Promise<Proveedor> {
    const proveedor = await this.proveedorRepository.findOne({ where: { id_proveedor: id } });
    if (!proveedor) throw new NotFoundException('Proveedor no encontrado');
    return proveedor;
  }

  async actualizar(id: number, dto: UpdateProveedorDto): Promise<Proveedor> {
    await this.proveedorRepository.update(id, dto);
    return this.obtenerPorId(id);
  }

  async eliminarLogico(id: number): Promise<string> {
    const proveedor = await this.obtenerPorId(id);
    proveedor.estado = false;
    await this.proveedorRepository.save(proveedor);
    return 'Proveedor desactivado exitosamente';
  }
}
