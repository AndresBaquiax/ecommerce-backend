import {
  Controller, Get, Post, Body, Param, Put, Delete,
} from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { FiltroPedidoDto } from './dto/filtro-pedido.dto';
import {
  ApiTags, ApiOperation, ApiResponse, ApiParam,
} from '@nestjs/swagger';

@ApiTags('Pedidos')
@Controller('pedidos')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo pedido con los productos seleccionados' })
  @ApiResponse({ status: 201, description: 'Pedido creado y registrado correctamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos en el pedido.' })
  create(@Body() dto: CreatePedidoDto) {
    return this.pedidoService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los pedidos realizados' })
  @ApiResponse({ status: 200, description: 'Listado completo de pedidos.' })
  findAll() {
    return this.pedidoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener los detalles de un pedido por su ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID único del pedido a consultar',
    required: true,
  })
  @ApiResponse({ status: 200, description: 'Pedido encontrado.' })
  @ApiResponse({ status: 404, description: 'No se encontró un pedido con ese ID.' })
  findOne(@Param('id') id: string) {
    return this.pedidoService.findOne(+id);
  }

  @Post('buscar')
  @ApiOperation({ summary: 'Buscar pedidos por estado, usuario o fechas (por body)' })
  @ApiResponse({ status: 200, description: 'Lista de pedidos filtrados.' })
  buscarBody(@Body() filtros: FiltroPedidoDto) {
    return this.pedidoService.buscarPedidos(filtros);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar la información de un pedido existente' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID del pedido que se desea actualizar',
    required: true,
  })
  @ApiResponse({ status: 200, description: 'Pedido actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Pedido no encontrado para actualizar.' })
  update(@Param('id') id: string, @Body() dto: UpdatePedidoDto) {
    return this.pedidoService.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancelar y eliminar un pedido por su ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID del pedido a eliminar',
    required: true,
  })
  @ApiResponse({ status: 200, description: 'Pedido eliminado correctamente.' })
  @ApiResponse({ status: 404, description: 'No se pudo eliminar, pedido no encontrado.' })
  remove(@Param('id') id: string) {
    return this.pedidoService.remove(+id);
  }
}
