import { Injectable } from '@nestjs/common';
import { Usuario } from './usuario.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsuarioRepository {
  constructor(
    @InjectRepository(Usuario)
    private readonly repo: Repository<Usuario>,
  ) {}

  async findByCorreo(correo: string): Promise<Usuario | null> {
    return this.repo.findOne({
      where: { correo },
      relations: ['rol'],
    });
  }
}
