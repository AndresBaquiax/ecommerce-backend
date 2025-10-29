import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { InventarioService } from './inventario.service';
import { CreateInventarioDto } from './dto/crear-inventario.dto';
import { UpdateInventarioDto } from './dto/actualizar-inventario.dto';

@UseGuards(JwtAuthGuard)
@Controller('inventario')
export class InventarioController {
  constructor(private readonly service: InventarioService) {}

  @Post()
  crear(@Body() dto: CreateInventarioDto) {
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

  @Get('cantidad/:id_producto')
  obtenerCantidadPorProducto(@Param('id_producto', ParseIntPipe) id_producto: number) {
    return this.service.obtenerCantidadPorProducto(id_producto);
  }

  @Patch(':id')
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateInventarioDto,
  ) {
    return this.service.actualizar(id, dto);
  }

  @Patch('eliminar/:id')
  eliminarLogico(@Param('id', ParseIntPipe) id: number) {
   return this.service.eliminarLogico(id);
  }
}
