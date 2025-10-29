import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUsuario } from './register.entity';
import { CreateUsuarioDto2 } from './dto/create-usuario.dto';

import * as bcrypt from 'bcrypt';
@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(RegisterUsuario)
    private usuarioRepo: Repository<RegisterUsuario>,
  ) {}

  async crearUsuario(dto: CreateUsuarioDto2): Promise<RegisterUsuario> {
    const existe = await this.usuarioRepo.findOne({
      where: { correo: dto.correo },
    });
    if (existe) throw new ConflictException('El correo ya está registrado');

    if (typeof dto.contrasena !== 'string') {
      throw new Error('La contraseña debe ser una cadena de texto');
    }
    const contrasena: string = dto.contrasena;
    const hash = await bcrypt.hash(contrasena, 10);
    const nuevoUsuario = this.usuarioRepo.create({
      ...dto,
      contrasenaHash: hash,
      estado: true,
      fechaCreacion: new Date(),
    });

    return this.usuarioRepo.save(nuevoUsuario);
  }
}
