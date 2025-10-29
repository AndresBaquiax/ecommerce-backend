import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from './categoria.entity';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Injectable()
export class CategoriaService {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepo: Repository<Categoria>,
  ) {}

  create(dto: CreateCategoriaDto) {
    const categoria = this.categoriaRepo.create(dto);
    return this.categoriaRepo.save(categoria);
  }

  findAll() {
    return this.categoriaRepo.find();
  }

  findOne(id: number) {
    return this.categoriaRepo.findOneBy({ id_categoria: id });
  }

  async update(id: number, dto: UpdateCategoriaDto) {
    const categoria = await this.categoriaRepo.preload({
      id_categoria: id,
      ...dto,
    });
    if (!categoria) throw new NotFoundException('Categoría no encontrada');
    return this.categoriaRepo.save(categoria);
  }

  async remove(id: number) {
  const categoria = await this.findOne(id);
  if (!categoria) {
    throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
  }
  return this.categoriaRepo.remove(categoria);
  }
}
