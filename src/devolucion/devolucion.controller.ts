import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Put } from '@nestjs/common';
import { DevolucionService } from './devolucion.service';
import { CreateDevolucionDto } from './dto/create-devolucion.dto';
import { UpdateDevolucionDto } from './dto/update-devolucion.dto';

@Controller('devolucion')
export class DevolucionController {
  constructor(private readonly devolucionService: DevolucionService) {}

  @Post()
  create(@Body() dto: CreateDevolucionDto) {
    return this.devolucionService.crearDevolucion(dto);
  }

  @Get()
  findAll() {
    return this.devolucionService.obtenerTodasLasDevoluciones();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.devolucionService.obtenerPorId(id);
  }

  @Get('user/:id')
  findOneByUser(@Param('id') id: number) {
    return this.devolucionService.findAllByUserId(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDevolucionDto) {
    return this.devolucionService.actualizarPorId(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.devolucionService.eliminarPorId(id);
  }
}
