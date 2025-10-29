import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lotes } from './lotes.entity';
import { CreateLoteDto } from './dto/create-lote.dto';
import { UpdateLoteDto } from './dto/update-lote.dto';

@Injectable()
export class LotesService {
  constructor(
    @InjectRepository(Lotes)
    private readonly lotesRepository: Repository<Lotes>,
  ) {}

  async create(createLoteDto: CreateLoteDto): Promise<Lotes> {
    const lote = this.lotesRepository.create({
      ...createLoteDto,
      estado: true
    });
    return await this.lotesRepository.save(lote);
  }

  async findAll(): Promise<Lotes[]> {
    return await this.lotesRepository.find({
      where: { estado: true }
    });
  }

  async findOne(id: number): Promise<Lotes> {
    const lote = await this.lotesRepository.findOne({ where: { id_lote: id } });
    if (!lote) {
      throw new NotFoundException(`Lote with ID ${id} not found`);
    }
    return lote;
  }

  async update(id: number, updateLoteDto: UpdateLoteDto): Promise<Lotes> {
    const lote = await this.findOne(id);
    Object.assign(lote, {
      ...updateLoteDto,
      estado: true
    });
    return await this.lotesRepository.save(lote);
  }

  async remove(id: number): Promise<{ "estado actual": boolean }> {
    const lote = await this.findOne(id);
    lote.estado = !lote.estado; // Alterna entre true/false
    await this.lotesRepository.save(lote);
    return { "estado actual": lote.estado };
  }
}
