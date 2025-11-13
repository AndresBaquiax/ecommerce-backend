import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Usuario } from './usuario.entity';
import { Rol } from 'src/rol/rol.entity';
import { EstadoCliente } from 'src/estado-cliente/estado-cliente.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/actualizar-usuario.dto';

const SALT_ROUNDS = 10;

function labelFromEstado(estado: number | null | undefined): string | null {
  if (estado === null || estado === undefined) return null;
  switch (estado) {
    case 2:
      return 'Posible';
    case 3:
      return 'Potencial';
    case 4:
      return 'Fidelizado';
    default:
      return null;
  }
}

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario) private readonly usuarioRepo: Repository<Usuario>,
    @InjectRepository(Rol) private readonly rolRepo: Repository<Rol>,
    @InjectRepository(EstadoCliente) private readonly estadoRepo: Repository<EstadoCliente>,
  ) {}

  async findByCorreo(correo: string): Promise<Usuario | null> {
    return this.usuarioRepo.findOne({ where: { correo }, relations: ['rol'] });
  }

  async crear(dto: CreateUsuarioDto): Promise<Usuario> {
    // Use a lightweight query to check existence to avoid eager joins (which fail if related tables
    // like estado_cliente are missing). QueryBuilder won't auto-join eager relations.
    const existsRaw = await this.usuarioRepo
      .createQueryBuilder('u')
      .select('u.id_usuario')
      .where('u.correo = :correo', { correo: dto.correo })
      .getRawOne();
    if (existsRaw) throw new BadRequestException('El correo ya está registrado');

    const rol = await this.rolRepo.findOne({ where: { id_rol: dto.id_rol } });
    if (!rol) throw new BadRequestException('Rol no válido');

    const hash = await bcrypt.hash(dto.contrasena, SALT_ROUNDS);

    const mapDtoEstadoToBool = (e: any): boolean => {
      // dto.estado can be number (0..4) or boolean; DB expects boolean for usuario.estado
      if (e === undefined || e === null) return true; // default -> true (active / possible)
      if (typeof e === 'boolean') return e;
      if (typeof e === 'number') return e !== 0; // treat 0 as false, others true
      // fallback
      return true;
    };

    const user = this.usuarioRepo.create({
      nombre: dto.nombre,
      telefono: dto.telefono,
      direccion: dto.direccion ?? null,
      correo: dto.correo,
      contrasena_hash: hash,
      // DB currently has usuario.estado as boolean. Map incoming dto to boolean here.
      estado: mapDtoEstadoToBool(dto.estado),
      fecha_creacion: new Date(),
      rol,
    });

  const saved = await this.usuarioRepo.save(user);

    // Ensure an estado_cliente row exists for this user. Wrap in try/catch so the
    // app doesn't crash if the table is not yet created in the DB. This keeps dev flow
    // working until you run the SQL migration file `db/estado_cliente_init.sql`.
    try {
      const existsEstado = await this.estadoRepo.findOne({ where: { id_usuario: saved.id_usuario } });
      if (!existsEstado) {
        // For estado_cliente (per-user numeric state) we keep numeric states.
        // If caller provided a numeric state, use it; otherwise default to 2 (Posible).
        const estadoNumeric = (dto && dto.estado !== undefined && typeof dto.estado === 'number') ? dto.estado : 2;
        await this.estadoRepo.save({ id_usuario: saved.id_usuario, estado: estadoNumeric });
      }
    } catch (err) {
      // If the relation/table is missing or other DB error occurs, warn and continue.
      // Do not throw so that the user creation still succeeds.
      // eslint-disable-next-line no-console
      console.warn('Warning: could not create or check estado_cliente (table may be missing):', err?.message ?? err);
    }

    // Return the full user payload (with relations and computed estado label) for clients
    try {
      return await this.obtenerPorId(saved.id_usuario);
    } catch (e) {
      return saved;
    }
  }

  async obtenerTodos(): Promise<Usuario[]> {
    // Try to load estadoCliente relation; if the table is missing, fall back to loading without it
    try {
      const users = await this.usuarioRepo.find({ relations: ['rol', 'estadoCliente'] });
      // attach a human-friendly estado_cliente label
      return users.map((u) => ({
        ...u,
        estado_cliente_num: u.estadoCliente?.estado ?? null,
        estado_cliente_label: labelFromEstado(u.estadoCliente?.estado ?? null),
      }));
    } catch (err) {
      console.warn('Warning: could not load estadoCliente relation when obtaining all usuarios:', err?.message ?? err);
      const users = await this.usuarioRepo.find({ relations: ['rol'] });
      return users.map((u) => ({
        ...u,
        estado_cliente_num: null,
        estado_cliente_label: null,
      }));
    }
  }

  async obtenerPorId(id: number): Promise<Usuario> {
    try {
      const user = await this.usuarioRepo.findOne({ where: { id_usuario: id }, relations: ['rol', 'estadoCliente'] });
      if (!user) throw new NotFoundException('Usuario no encontrado');
      return {
        ...user,
        estado_cliente_num: user.estadoCliente?.estado ?? null,
        estado_cliente_label: labelFromEstado(user.estadoCliente?.estado ?? null),
      } as any;
    } catch (err) {
      // If estado_cliente missing or other DB error, try again without the relation
      console.warn('Warning: could not load estadoCliente relation for obtenerPorId:', err?.message ?? err);
      const user = await this.usuarioRepo.findOne({ where: { id_usuario: id }, relations: ['rol'] });
      if (!user) throw new NotFoundException('Usuario no encontrado');
      return {
        ...user,
        estado_cliente_num: null,
        estado_cliente_label: null,
      } as any;
    }
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
    if (dto.estado !== undefined) {
      // map to boolean for usuario.estado
      if (typeof dto.estado === 'boolean') user.estado = dto.estado;
      else if (typeof dto.estado === 'number') user.estado = dto.estado !== 0;
      else user.estado = true;
    }

    await this.usuarioRepo.save(user);
    return this.obtenerPorId(id);
  }

  async eliminarLogico(id: number): Promise<string> {
    const user = await this.obtenerPorId(id);
  // mark as eliminado (0)
  // usuario.estado is boolean in DB; mark as false (logical delete)
  user.estado = false;
    await this.usuarioRepo.save(user);
    return 'Usuario desactivado exitosamente';
  }
}
