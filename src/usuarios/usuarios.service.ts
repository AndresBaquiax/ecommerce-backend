import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuarios } from './usuarios.entity';
import { Repository } from 'typeorm';
import { CreateUsuariosDto } from './dto/crear-usuarios.dto';
import { UpdateUsuariosDto } from './dto/actualizar-usuarios.dto';
import { Usuario } from 'src/usuario/usuario.entity';
import { Factura } from 'src/factura/factura.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuarios)
    private readonly usuariosRepo: Repository<Usuarios>,
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
    @InjectRepository(Factura)
    private readonly facturaRepo: Repository<Factura>,
  ) {}

  async crear(dto: CreateUsuariosDto): Promise<Usuarios> {
    const usuario = await this.usuarioRepo.findOne({
      where: { id_usuario: dto.id_usuario },
    });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    const factura = await this.facturaRepo.findOne({
      where: { id_factura: dto.id_factura },
    });
    if (!factura) throw new NotFoundException('Factura no encontrada');

    const relacion = this.usuariosRepo.create({
      usuario,
      factura,
    });

    return this.usuariosRepo.save(relacion);
  }

  async obtenerTodos(): Promise<Usuarios[]> {
    return this.usuariosRepo.find({
      relations: ['usuario', 'factura'],
      order: { id: 'DESC' },
    });
  }

  async obtenerPorId(id: number): Promise<Usuarios> {
    const relacion = await this.usuariosRepo.findOne({
      where: { id },
      relations: ['usuario', 'factura'],
    });
    if (!relacion) throw new NotFoundException('Relación no encontrada');
    return relacion;
  }

  async actualizar(id: number, dto: UpdateUsuariosDto): Promise<Usuarios> {
    const relacion = await this.obtenerPorId(id);

    if (dto.id_usuario) {
      const usuario = await this.usuarioRepo.findOne({
        where: { id_usuario: dto.id_usuario },
      });
      if (!usuario) throw new NotFoundException('Usuario no encontrado');
      relacion.usuario = usuario;
    }

    if (dto.id_factura) {
      const factura = await this.facturaRepo.findOne({
        where: { id_factura: dto.id_factura },
      });
      if (!factura) throw new NotFoundException('Factura no encontrada');
      relacion.factura = factura;
    }

    return this.usuariosRepo.save(relacion);
  }

  async obtenerComprasPorUsuario(idUsuario: number): Promise<Usuarios[]> {
    // Primero verificar que el usuario existe
    const usuario = await this.usuarioRepo.findOne({
      where: { id_usuario: idUsuario },
    });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    // Obtener todas las relaciones usuario-factura para este usuario
    return this.usuariosRepo.find({
      where: { 
        usuario: { id_usuario: idUsuario } 
      },
      relations: ['usuario', 'factura', 'factura.proveedor'],
      order: { created_at: 'DESC' },
    });
  }

  async eliminar(id: number): Promise<void> {
    const relacion = await this.obtenerPorId(id);
    await this.usuariosRepo.remove(relacion);
  }
}
