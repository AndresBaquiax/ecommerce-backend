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
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { DetalleFacturaService } from './detalle_factura.service';
import { CreateDetalleFacturaDto } from './dto/crear-detalle-factura.dto';
import { UpdateDetalleFacturaDto } from './dto/actualizar-detalle-factura.dto';

@ApiTags('Detalle Factura')
@UseGuards(JwtAuthGuard)
@Controller('detalles-factura')
export class DetalleFacturaController {
  constructor(private readonly service: DetalleFacturaService) {}

  @Post()
  @ApiOperation({ summary: 'Crear detalle de factura' })
  @ApiBody({ type: CreateDetalleFacturaDto })
  @ApiResponse({
    status: 201,
    description: 'Detalle de factura creado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id_detalle: { type: 'number', example: 1 },
        cantidad: { type: 'number', example: 5 },
        precio_unitario: { type: 'number', example: 49.99 },
        factura: {
          type: 'object',
          properties: { id_factura: { type: 'number', example: 1 } }
        },
        inventario: {
          type: 'object',
          properties: { id_inventario: { type: 'number', example: 2 } }
        },
        lote: {
          type: 'object',
          properties: { id_lote: { type: 'number', example: 5 } }
        },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
    },
  })
  crear(@Body() dto: CreateDetalleFacturaDto) {
    return this.service.crear(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los detalles de factura' })
  @ApiResponse({
    status: 200,
    description: 'Lista de detalles de factura obtenida exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id_detalle: { type: 'number', example: 1 },
          cantidad: { type: 'number', example: 5 },
          precio_unitario: { type: 'number', example: 49.99 },
          factura: {
            type: 'object',
            properties: { id_factura: { type: 'number', example: 1 } }
          },
          inventario: {
            type: 'object',
            properties: { id_inventario: { type: 'number', example: 2 } }
          },
          lote: {
            type: 'object',
            properties: { id_lote: { type: 'number', example: 5 } }
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
  @ApiOperation({ summary: 'Obtener detalle de factura por ID' })
  @ApiParam({ name: 'id', example: 1, description: 'ID del detalle de factura' })
  @ApiResponse({
    status: 200,
    description: 'Detalle de factura encontrado',
    schema: {
      type: 'object',
      properties: {
        id_detalle: { type: 'number', example: 1 },
        cantidad: { type: 'number', example: 5 },
        precio_unitario: { type: 'number', example: 49.99 },
        factura: {
          type: 'object',
          properties: { id_factura: { type: 'number', example: 1 } }
        },
        inventario: {
          type: 'object',
          properties: { id_inventario: { type: 'number', example: 2 } }
        },
        lote: {
          type: 'object',
          properties: { id_lote: { type: 'number', example: 5 } }
        },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Detalle de factura no encontrado' })
  obtenerPorId(@Param('id', ParseIntPipe) id: number) {
    return this.service.obtenerPorId(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar detalle de factura' })
  @ApiParam({ name: 'id', example: 1, description: 'ID del detalle de factura' })
  @ApiBody({ type: UpdateDetalleFacturaDto })
  @ApiResponse({
    status: 200,
    description: 'Detalle de factura actualizado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id_detalle: { type: 'number', example: 1 },
        cantidad: { type: 'number', example: 7 },
        precio_unitario: { type: 'number', example: 50.00 },
        factura: {
          type: 'object',
          properties: { id_factura: { type: 'number', example: 1 } }
        },
        inventario: {
          type: 'object',
          properties: { id_inventario: { type: 'number', example: 2 } }
        },
        lote: {
          type: 'object',
          properties: { id_lote: { type: 'number', example: 5 } }
        },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Detalle de factura no encontrado' })
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDetalleFacturaDto,
  ) {
    return this.service.actualizar(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar detalle de factura' })
  @ApiParam({ name: 'id', example: 1, description: 'ID del detalle de factura' })
  @ApiResponse({
    status: 200,
    description: 'Detalle de factura eliminado exitosamente',
    schema: {
      type: 'object',
      properties: {
        mensaje: { type: 'string', example: 'Detalle de factura eliminado exitosamente' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Detalle de factura no encontrado' })
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.service.eliminar(id);
  }
}
