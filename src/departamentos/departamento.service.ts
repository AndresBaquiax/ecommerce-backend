import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Departamento } from './departamento.entity';
import { CreateDepartamentoDto } from './dto/crear-departamento.dto';
import { UpdateDepartamentoDto } from './dto/actualizar-departamento.dto';

@Injectable()
export class DepartamentoService {
  constructor(
    @InjectRepository(Departamento)
    private departamentoRepo: Repository<Departamento>,
  ) {}

  async crear(dto: CreateDepartamentoDto): Promise<Departamento> {
    const departamento = this.departamentoRepo.create({
      departamento: dto.departamento,
      estado: dto.estado ?? true,
    });

    return this.departamentoRepo.save(departamento);
  }

  async obtenerTodos(): Promise<Departamento[]> {
    return this.departamentoRepo.find({
      where: { estado: true },
      order: { id_departamento: 'DESC' },
    });
  }

  async obtenerPorId(id: number): Promise<Departamento> {
    const departamento = await this.departamentoRepo.findOne({
      where: { id_departamento: id, estado: true },
    });
    
    if (!departamento) {
      throw new NotFoundException('Departamento no encontrado');
    }
    
    return departamento;
  }

  async actualizar(id: number, dto: UpdateDepartamentoDto): Promise<Departamento> {
    const departamento = await this.obtenerPorId(id);

    if (dto.departamento !== undefined) {
      departamento.departamento = dto.departamento;
    }
    
    if (dto.estado !== undefined) {
      departamento.estado = dto.estado;
    }

    return this.departamentoRepo.save(departamento);
  }

  async eliminarLogico(id: number): Promise<Departamento> {
    const departamento = await this.obtenerPorId(id);
    departamento.estado = false;
    return this.departamentoRepo.save(departamento);
  }
}
