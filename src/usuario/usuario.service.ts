import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Usuario } from './usuario.entity';
import { Rol } from 'src/rol/rol.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/actualizar-usuario.dto';

const SALT_ROUNDS = 10;

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario) private readonly usuarioRepo: Repository<Usuario>,
    @InjectRepository(Rol) private readonly rolRepo: Repository<Rol>,
  ) {}

  async findByCorreo(correo: string): Promise<Usuario | null> {
    return this.usuarioRepo.findOne({ where: { correo }, relations: ['rol'] });
  }

  async crear(dto: CreateUsuarioDto): Promise<Usuario> {
    const exists = await this.usuarioRepo.findOne({ where: { correo: dto.correo } });
    if (exists) throw new BadRequestException('El correo ya está registrado');

    const rol = await this.rolRepo.findOne({ where: { id_rol: dto.id_rol } });
    if (!rol) throw new BadRequestException('Rol no válido');

    const hash = await bcrypt.hash(dto.contrasena, SALT_ROUNDS);

    const user = this.usuarioRepo.create({
      nombre: dto.nombre,
      telefono: dto.telefono,
      direccion: dto.direccion ?? null,
      correo: dto.correo,
      contrasena_hash: hash,
      estado: dto.estado ?? true,
      fecha_creacion: new Date(),
      rol,
    });

    return this.usuarioRepo.save(user);
  }

  async obtenerTodos(): Promise<Usuario[]> {
    return this.usuarioRepo.find({ relations: ['rol'] });
  }

  async obtenerPorId(id: number): Promise<Usuario> {
    const user = await this.usuarioRepo.findOne({ where: { id_usuario: id }, relations: ['rol'] });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async actualizar(id: number, dto: UpdateUsuarioDto): Promise<Usuario> {
    const user = await this.obtenerPorId(id);

    if (dto.correo && dto.correo !== user.correo) {
      const exists = await this.usuarioRepo.findOne({ where: { correo: dto.correo } });
      if (exists) throw new BadRequestException('El correo ya está registrado');
    }

    if (dto.id_rol) {
      const rol = await this.rolRepo.findOne({ where: { id_rol: dto.id_rol } });
      if (!rol) throw new BadRequestException('Rol no válido');
      user.rol = rol;
    }

    if (dto.contrasena) {
      user.contrasena_hash = await bcrypt.hash(dto.contrasena, SALT_ROUNDS);
    }

    user.nombre = dto.nombre ?? user.nombre;
    user.telefono = dto.telefono ?? user.telefono;
    user.direccion = dto.direccion ?? user.direccion;
    user.correo = dto.correo ?? user.correo;
    if (dto.estado !== undefined) user.estado = dto.estado;

    await this.usuarioRepo.save(user);
    return this.obtenerPorId(id);
  }

  async eliminarLogico(id: number): Promise<string> {
    const user = await this.obtenerPorId(id);
    user.estado = false;
    await this.usuarioRepo.save(user);
    return 'Usuario desactivado exitosamente';
  }
}
