import {
  Controller, Get, Post, Body, Param, Put, Delete,
} from '@nestjs/common';
import { DireccionService } from './direccion.service';
import { CreateDireccionDto } from './dto/create-direccion.dto';
import { UpdateDireccionDto } from './dto/update-direccion.dto';
import {
  ApiTags, ApiOperation, ApiResponse, ApiParam,
} from '@nestjs/swagger';

@ApiTags('Direcciones')
@Controller('direcciones')
export class DireccionController {
  constructor(private readonly direccionService: DireccionService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar una nueva dirección del usuario' })
  @ApiResponse({ status: 201, description: 'Dirección registrada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos en la solicitud.' })
  create(@Body() dto: CreateDireccionDto) {
    return this.direccionService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las direcciones registradas' })
  @ApiResponse({ status: 200, description: 'Listado de direcciones obtenido correctamente.' })
  findAll() {
    return this.direccionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar una dirección específica por su ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID único de la dirección que se desea consultar',
    required: true,
  })
  @ApiResponse({ status: 200, description: 'Dirección encontrada.' })
  @ApiResponse({ status: 404, description: 'No se encontró una dirección con ese ID.' })
  findOne(@Param('id') id: string) {
    return this.direccionService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Editar una dirección existente por ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID de la dirección a modificar',
    required: true,
  })
  @ApiResponse({ status: 200, description: 'Dirección actualizada correctamente.' })
  @ApiResponse({ status: 404, description: 'No se puede actualizar, dirección no encontrada.' })
  update(@Param('id') id: string, @Body() dto: UpdateDireccionDto) {
    return this.direccionService.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una dirección por su ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID de la dirección que se desea eliminar',
    required: true,
  })
  @ApiResponse({ status: 200, description: 'Dirección eliminada exitosamente.' })
  @ApiResponse({ status: 404, description: 'No se puede eliminar, dirección no encontrada.' })
  remove(@Param('id') id: string) {
    return this.direccionService.remove(+id);
  }
}
