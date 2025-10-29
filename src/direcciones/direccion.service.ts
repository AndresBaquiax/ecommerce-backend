import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Direccion } from './direccion.entity';
import { CreateDireccionDto } from './dto/create-direccion.dto';
import { UpdateDireccionDto } from './dto/update-direccion.dto';

@Injectable()
export class DireccionService {
  constructor(
    @InjectRepository(Direccion)
    private readonly direccionRepo: Repository<Direccion>,
  ) {}

  create(dto: CreateDireccionDto) {
    const direccion = this.direccionRepo.create(dto);
    return this.direccionRepo.save(direccion);
  }

  findAll() {
    return this.direccionRepo.find();
  }

  findOne(id: number) {
    return this.direccionRepo.findOneBy({ id_direccion: id });
  }

  findByUsuarioId(id_usuario: number) {
    return this.direccionRepo.findOneBy({ id_usuario });
  }

  async update(id: number, dto: UpdateDireccionDto) {
    const direccion = await this.direccionRepo.preload({
      id_direccion: id,
      ...dto,
    });
    if (!direccion) throw new NotFoundException('Dirección no encontrada');
    return this.direccionRepo.save(direccion);
  }
    async remove(id: number) {
    const direccion = await this.findOne(id);
    if (!direccion) {
      throw new NotFoundException(`Dirección con ID ${id} no encontrada`);
    }
    return this.direccionRepo.remove(direccion);
  }
}
