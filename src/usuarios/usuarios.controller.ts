import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { UsuariosService } from './usuarios.service';
import { CreateUsuariosDto } from './dto/crear-usuarios.dto';
import { UpdateUsuariosDto } from './dto/actualizar-usuarios.dto';

@ApiTags('Usuarios-Factura')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('usuarios-factura')
export class UsuariosController {
  constructor(private readonly service: UsuariosService) {}

  @Post()
  @ApiOperation({ summary: 'Relacionar usuario con factura' })
  @ApiBody({
    type: CreateUsuariosDto,
    examples: {
      ejemplo1: {
        summary: 'Ejemplo',
        value: {
          id_usuario: 3,
          id_factura: 5,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Relación creada exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        usuario: {
          type: 'object',
          properties: {
            id_usuario: { type: 'number', example: 3 }
          },
        },
        factura: {
          type: 'object',
          properties: {
            id_factura: { type: 'number', example: 5 }
          },
        },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
    },
  })
  crear(@Body() dto: CreateUsuariosDto) {
    return this.service.crear(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las relaciones usuario-factura' })
  @ApiResponse({
    status: 200,
    description: 'Relaciones obtenidas exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          usuario: {
            type: 'object',
            properties: {
              id_usuario: { type: 'number', example: 3 },
              nombre: { type: 'string', example: 'Juan Pérez' },
            },
          },
          factura: {
            type: 'object',
            properties: {
              id_factura: { type: 'number', example: 5 },
              tipo: { type: 'string', example: 'Compra' },
            },
          },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  obtenerTodos() {
    return this.service.obtenerTodos();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una relación por ID' })
  @ApiParam({ name: 'id', example: 1, description: 'ID de la relación' })
  @ApiResponse({
    status: 200,
    description: 'Relación obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        usuario: {
          type: 'object',
          properties: {
            id_usuario: { type: 'number', example: 3 },
            nombre: { type: 'string', example: 'Juan Pérez' },
          },
        },
        factura: {
          type: 'object',
          properties: {
            id_factura: { type: 'number', example: 5 },
            tipo: { type: 'string', example: 'Compra' },
          },
        },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Relación no encontrada' })
  obtenerPorId(@Param('id', ParseIntPipe) id: number) {
    return this.service.obtenerPorId(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar relación usuario-factura' })
  @ApiParam({ name: 'id', example: 1, description: 'ID de la relación' })
  @ApiBody({
    type: UpdateUsuariosDto,
    examples: {
      ejemplo1: {
        summary: 'Ejemplo de actualización',
        value: {
          id_usuario: 4,
          id_factura: 10,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Relación actualizada exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        usuario: {
          type: 'object',
          properties: {
            id_usuario: { type: 'number', example: 4 },
            nombre: { type: 'string', example: 'Ana Martínez' },
          },
        },
        factura: {
          type: 'object',
          properties: {
            id_factura: { type: 'number', example: 10 },
            tipo: { type: 'string', example: 'Venta' },
          },
        },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
    },
  })
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUsuariosDto,
  ) {
    return this.service.actualizar(id, dto);
  }

  @Get('usuario/compras/:idUsuario')
  @ApiOperation({ summary: 'Obtener todas las compras de un usuario' })
  @ApiParam({ name: 'idUsuario', example: 3, description: 'ID del usuario' })
  @ApiResponse({
    status: 200,
    description: 'Compras del usuario obtenidas exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          usuario: {
            type: 'object',
            properties: {
              id_usuario: { type: 'number', example: 3 },
              nombre: { type: 'string', example: 'Juan Pérez' },
              email: { type: 'string', example: 'juan@email.com' },
            },
          },
          factura: {
            type: 'object',
            properties: {
              id_factura: { type: 'number', example: 5 },
              tipo: { type: 'string', example: 'Compra' },
              fecha: { type: 'string', format: 'date', example: '2025-01-15' },
              subtotal: { type: 'string', example: '100.00' },
              total: { type: 'string', example: '112.00' },
              descuento: { type: 'string', example: '0.00' },
              estado: { type: 'boolean', example: true },
            },
          },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  obtenerComprasPorUsuario(@Param('idUsuario', ParseIntPipe) idUsuario: number) {
    return this.service.obtenerComprasPorUsuario(idUsuario);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar relación usuario-factura' })
  @ApiParam({ name: 'id', example: 1, description: 'ID de la relación' })
  @ApiResponse({
    status: 200,
    description: 'Relación eliminada exitosamente',
    schema: {
      type: 'object',
      properties: {
        mensaje: { type: 'string', example: 'Relación eliminada exitosamente' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Relación no encontrada' })
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.service.eliminar(id);
  }
}
