import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AsignacionLotes } from './asignacion-lotes.entity';
import { CreateAsignacionLoteDto } from './dto/create-asignacion-lote.dto';
import { UpdateAsignacionLoteDto } from './dto/update-asignacion-lote.dto';

@Injectable()
export class AsignacionLotesService {
  constructor(
    @InjectRepository(AsignacionLotes)
    private readonly asignacionLotesRepository: Repository<AsignacionLotes>,
  ) {}

  async create(createAsignacionLoteDto: CreateAsignacionLoteDto): Promise<AsignacionLotes> {
    const asignacion = this.asignacionLotesRepository.create({
      ...createAsignacionLoteDto,
      estado: true
    });
    return await this.asignacionLotesRepository.save(asignacion);
  }

  async findAll(): Promise<AsignacionLotes[]> {
    return await this.asignacionLotesRepository.find({
      where: { estado: true }
    });
  }

  async findOne(id: number): Promise<AsignacionLotes> {
    const asignacion = await this.asignacionLotesRepository.findOne({ 
      where: { id_asignacion: id } 
    });
    if (!asignacion) {
      throw new NotFoundException(`Asignación de lote with ID ${id} not found`);
    }
    return asignacion;
  }

  async update(id: number, updateAsignacionLoteDto: UpdateAsignacionLoteDto): Promise<AsignacionLotes> {
    const asignacion = await this.findOne(id);
    Object.assign(asignacion, {
      ...updateAsignacionLoteDto,
      estado: true
    });
    return await this.asignacionLotesRepository.save(asignacion);
  }

  async remove(id: number): Promise<{ "estado actual": boolean }> {
    const asignacion = await this.findOne(id);
    asignacion.estado = !asignacion.estado; // Alterna entre true/false
    await this.asignacionLotesRepository.save(asignacion);
    return { "estado actual": asignacion.estado };
  }
}
