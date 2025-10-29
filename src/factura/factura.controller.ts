import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { FacturaService } from './factura.service';
import { CreateFacturaDto } from './dto/crear-factura.dto';
import { UpdateFacturaDto } from './dto/actualizar-factura.dto';

@ApiTags('Factura')
@UseGuards(JwtAuthGuard)
@Controller('facturas')
export class FacturaController {
  constructor(private readonly facturaService: FacturaService) {}

  @Post()
  @ApiOperation({ summary: 'Crear factura', description: 'Crea una nueva factura en el sistema' })
  @ApiBody({ type: CreateFacturaDto })
  @ApiResponse({
    status: 201,
    description: 'Factura creada exitosamente',
    schema: {
      type: 'object',
      properties: {
        id_factura: { type: 'number', example: 1 },
        tipo: { type: 'string', example: 'Compra' },
        fecha: { type: 'string', format: 'date', example: '2025-08-04' },
        subtotal: { type: 'string', example: '1000.00' },
        total: { type: 'string', example: '950.00' },
        descuento: { type: 'string', example: '50.00' },
        estado: { type: 'boolean', example: true },
        proveedor: {
          type: 'object',
          properties: {
            id_proveedor: { type: 'number', example: 1 },
            nombre: { type: 'string', example: 'Distribuidora Centroamericana' },
          },
        },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
    },
  })
  crear(@Body() dto: CreateFacturaDto) {
    return this.facturaService.crearFactura(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las facturas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de facturas obtenida exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id_factura: { type: 'number', example: 1 },
          tipo: { type: 'string', example: 'Compra' },
          fecha: { type: 'string', format: 'date', example: '2025-08-04' },
          subtotal: { type: 'string', example: '1000.00' },
          total: { type: 'string', example: '950.00' },
          descuento: { type: 'string', example: '50.00' },
          estado: { type: 'boolean', example: true },
          proveedor: {
            type: 'object',
            properties: {
              id_proveedor: { type: 'number', example: 1 },
              nombre: { type: 'string', example: 'Distribuidora Centroamericana' },
            },
          },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  obtenerTodos() {
    return this.facturaService.obtenerTodasLasFacturas();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener factura por ID' })
  @ApiParam({ name: 'id', description: 'ID de la factura', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Factura encontrada exitosamente',
    schema: {
      type: 'object',
      properties: {
        id_factura: { type: 'number', example: 1 },
        tipo: { type: 'string', example: 'Compra' },
        fecha: { type: 'string', format: 'date', example: '2025-08-04' },
        subtotal: { type: 'string', example: '1000.00' },
        total: { type: 'string', example: '950.00' },
        descuento: { type: 'string', example: '50.00' },
        estado: { type: 'boolean', example: true },
        proveedor: {
          type: 'object',
          properties: {
            id_proveedor: { type: 'number', example: 1 },
            nombre: { type: 'string', example: 'Distribuidora Centroamericana' },
          },
        },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Factura no encontrada' })
  obtenerPorId(@Param('id', ParseIntPipe) id: number) {
    return this.facturaService.obtenerPorIdFactura(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar factura' })
  @ApiParam({ name: 'id', description: 'ID de la factura a actualizar', example: 1 })
  @ApiBody({ type: UpdateFacturaDto })
  @ApiResponse({
    status: 200,
    description: 'Factura actualizada exitosamente',
    schema: {
      type: 'object',
      properties: {
        id_factura: { type: 'number', example: 1 },
        tipo: { type: 'string', example: 'Compra' },
        fecha: { type: 'string', format: 'date', example: '2025-08-04' },
        subtotal: { type: 'string', example: '1000.00' },
        total: { type: 'string', example: '950.00' },
        descuento: { type: 'string', example: '50.00' },
        estado: { type: 'boolean', example: true },
        proveedor: {
          type: 'object',
          properties: {
            id_proveedor: { type: 'number', example: 1 },
            nombre: { type: 'string', example: 'Distribuidora Centroamericana' },
          },
        },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Factura o proveedor no encontrado' })
  actualizar(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateFacturaDto) {
    return this.facturaService.actualizarFacturaPorId(id, dto);
  }

  @Patch('eliminar/:id')
  @ApiOperation({ summary: 'Eliminar (lógicamente) factura', description: 'Cambia el estado de la factura a false' })
  @ApiParam({ name: 'id', description: 'ID de la factura a eliminar', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Factura desactivada exitosamente',
    schema: {
      type: 'object',
      properties: {
        id_factura: { type: 'number', example: 1 },
        tipo: { type: 'string', example: 'Compra' },
        fecha: { type: 'string', format: 'date', example: '2025-08-04' },
        subtotal: { type: 'string', example: '1000.00' },
        total: { type: 'string', example: '950.00' },
        descuento: { type: 'string', example: '50.00' },
        estado: { type: 'boolean', example: false },
        proveedor: {
          type: 'object',
          properties: {
            id_proveedor: { type: 'number', example: 1 },
            nombre: { type: 'string', example: 'Distribuidora Centroamericana' },
          },
        },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Factura no encontrada' })
  eliminarLogico(@Param('id', ParseIntPipe) id: number) {
    return this.facturaService.eliminarLogicoFacturaPorId(id);
  }
}
