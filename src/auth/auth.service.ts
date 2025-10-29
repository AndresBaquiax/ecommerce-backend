import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from '../usuario/usuario.service';
import { DireccionService } from '../direcciones/direccion.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuariosService,
    private direccionService: DireccionService,
    private jwtService: JwtService,
  ) {}

  async login(correo: string, contrasena: string) {
    const usuario = await this.usuarioService.findByCorreo(correo);
    if (!usuario || !(await bcrypt.compare(contrasena, usuario.contrasena_hash))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Obtener la dirección del usuario
    const direccion = await this.direccionService.findByUsuarioId(usuario.id_usuario);

    const payload = {
      sub: usuario.id_usuario,
      rol: usuario.rol.nombre,
      id_direccion: direccion?.id_direccion || null,
    };

    return {
      token: this.jwtService.sign(payload),
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol.nombre,
      },
    };
  }
}
