import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Oferta } from './oferta.entity';
import { CreateOfertaDto } from './dto/create-oferta.dto';
import { UpdateOfertaDto } from './dto/update-oferta.dto';

@Injectable()
export class OfertasService {
  constructor(
    @InjectRepository(Oferta)
    private ofertasRepository: Repository<Oferta>,
  ) {}

  async create(createOfertaDto: CreateOfertaDto): Promise<Oferta> {
    const oferta = this.ofertasRepository.create(createOfertaDto);
    return this.ofertasRepository.save(oferta);
  }

  async findAll(): Promise<Oferta[]> {
    return this.ofertasRepository.find({
      relations: ['producto'],
      order: { id_oferta: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Oferta> {
    const oferta = await this.ofertasRepository.findOne({
      where: { id_oferta: id },
      relations: ['producto']
    });
    if (!oferta) {
      throw new NotFoundException(`Oferta con ID ${id} no encontrada`);
    }
    return oferta;
  }

  async update(id: number, updateOfertaDto: UpdateOfertaDto): Promise<Oferta> {
    await this.findOne(id);
    await this.ofertasRepository.update(id, updateOfertaDto);
    return this.findOne(id);
  }
}
