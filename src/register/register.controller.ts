import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UsuarioService } from './register.service';
import { CreateUsuarioDto2 } from './dto/create-usuario.dto';
import { RegisterUsuario } from './register.entity';

@ApiTags('User Registration')
@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @ApiOperation({ 
    summary: 'Registrar nuevo usuario', 
    description: 'Crea un nuevo usuario en el sistema con los datos proporcionados' 
  })
  @ApiBody({ type: CreateUsuarioDto2 })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuario creado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id_usuario: { type: 'number', example: 1 },
        nombre: { type: 'string', example: 'Juan Pérez' },
        telefono: { type: 'string', example: '+502 1234-5678' },
        direccion: { type: 'string', example: 'Ciudad de Guatemala' },
        correo: { type: 'string', example: 'juan@example.com' },
        estado: { type: 'boolean', example: true },
        fechaCreacion: { type: 'string', format: 'date-time', example: '2025-01-26T12:00:00Z' },
        id_rol: { type: 'number', example: 2 },
        createdAt: { type: 'string', format: 'date-time', example: '2025-01-26T12:00:00Z' },
        updatedAt: { type: 'string', format: 'date-time', example: '2025-01-26T12:00:00Z' }
      }
    }
  })
  @ApiResponse({ 
    status: 409, 
    description: 'El correo ya está registrado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 409 },
        message: { type: 'string', example: 'El correo ya está registrado' },
        error: { type: 'string', example: 'Conflict' }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos de entrada inválidos',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { 
          type: 'array', 
          items: { type: 'string' },
          example: [
            'nombre should not be empty',
            'contrasena must be longer than or equal to 6 characters',
            'correo must be an email'
          ]
        },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  @Post('registro')
  crearUsuario(@Body() dto: CreateUsuarioDto2): Promise<RegisterUsuario> {
    return this.usuarioService.crearUsuario(dto);
  }
}

//register.service.ts cambios