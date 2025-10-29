import {
  Controller,
  Get,
  Post,
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
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { ProveedorService } from './proveedor.service';
import { CreateProveedorDto } from './dto/crear-proveedor.dto';
import { UpdateProveedorDto } from './dto/actualizar-proveedor.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@ApiTags('Proveedor')
@UseGuards(JwtAuthGuard)
@Controller('proveedores')
export class ProveedorController {
  constructor(private readonly proveedorService: ProveedorService) {}

  @Post()
  @ApiOperation({ summary: 'Crear proveedor', description: 'Crea un nuevo proveedor en el sistema' })
  @ApiBody({ type: CreateProveedorDto })
  @ApiResponse({
    status: 201,
    description: 'Proveedor creado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id_proveedor: { type: 'number', example: 1 },
        nombre: { type: 'string', example: 'Distribuidora Centroamericana' },
        telefono: { type: 'string', example: '+502 1234-5678' },
        nit: { type: 'string', example: '1234567-8' },
        estado: { type: 'boolean', example: true },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  crear(@Body() dto: CreateProveedorDto) {
    return this.proveedorService.crear(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los proveedores' })
  @ApiResponse({
    status: 200,
    description: 'Lista de proveedores obtenida exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id_proveedor: { type: 'number', example: 1 },
          nombre: { type: 'string', example: 'Distribuidora Centroamericana' },
          telefono: { type: 'string', example: '+502 1234-5678' },
          nit: { type: 'string', example: '1234567-8' },
          estado: { type: 'boolean', example: true },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  obtenerTodos() {
    return this.proveedorService.obtenerTodos();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener proveedor por ID' })
  @ApiParam({ name: 'id', description: 'ID del proveedor', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Proveedor obtenido exitosamente',
    schema: {
      type: 'object',
      properties: {
        id_proveedor: { type: 'number', example: 1 },
        nombre: { type: 'string', example: 'Distribuidora Centroamericana' },
        telefono: { type: 'string', example: '+502 1234-5678' },
        nit: { type: 'string', example: '1234567-8' },
        estado: { type: 'boolean', example: true },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Proveedor no encontrado' })
  obtenerPorId(@Param('id', ParseIntPipe) id: number) {
    return this.proveedorService.obtenerPorId(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar proveedor' })
  @ApiParam({ name: 'id', description: 'ID del proveedor', example: 1 })
  @ApiBody({ type: UpdateProveedorDto })
  @ApiResponse({
    status: 200,
    description: 'Proveedor actualizado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id_proveedor: { type: 'number', example: 1 },
        nombre: { type: 'string', example: 'Distribuidora Centroamericana' },
        telefono: { type: 'string', example: '+502 1234-5678' },
        nit: { type: 'string', example: '1234567-8' },
        estado: { type: 'boolean', example: true },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Proveedor no encontrado' })
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProveedorDto,
  ) {
    return this.proveedorService.actualizar(id, dto);
  }

  @Patch('eliminar/:id')
  @ApiOperation({ summary: 'Eliminar proveedor (lógico)', description: 'Desactiva el proveedor cambiando su estado a false' })
  @ApiParam({ name: 'id', description: 'ID del proveedor', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Proveedor desactivado exitosamente',
    schema: {
      type: 'object',
      properties: {
        mensaje: { type: 'string', example: 'Proveedor desactivado exitosamente' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Proveedor no encontrado' })
  eliminarLogico(@Param('id', ParseIntPipe) id: number) {
    return this.proveedorService.eliminarLogico(id);
  }
}
