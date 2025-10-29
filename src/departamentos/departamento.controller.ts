import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { DepartamentoService } from './departamento.service';
import { CreateDepartamentoDto } from './dto/crear-departamento.dto';
import { UpdateDepartamentoDto } from './dto/actualizar-departamento.dto';

@Controller('departamentos')
export class DepartamentoController {
  constructor(private readonly service: DepartamentoService) {}

  @Post()
  crear(@Body() dto: CreateDepartamentoDto) {
    return this.service.crear(dto);
  }

  @Get()
  obtenerTodos() {
    return this.service.obtenerTodos();
  }

  @Get(':id')
  obtenerPorId(@Param('id', ParseIntPipe) id: number) {
    return this.service.obtenerPorId(id);
  }

  @Put(':id')
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDepartamentoDto,
  ) {
    return this.service.actualizar(id, dto);
  }

  @Delete(':id')
  eliminarLogico(@Param('id', ParseIntPipe) id: number) {
    return this.service.eliminarLogico(id);
  }
}
