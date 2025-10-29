import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Categorías')
@Controller('categorias')
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una categoría' })
  @ApiResponse({ status: 201, description: 'Categoría creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos en el cuerpo de la solicitud.' })
  @ApiBody({
    schema: {
      example: {
        nombre: 'Lácteos',
        descripcion: 'Productos derivados de la leche',
      },
    },
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(@Body() dto: CreateCategoriaDto) {
    return this.categoriaService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las categorías' })
  @ApiResponse({ status: 200, description: 'Listado de categorías obtenido correctamente.' })
  findAll() {
    return this.categoriaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una categoría por ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID único de la categoría a consultar',
    required: true,
  })
  @ApiResponse({ status: 200, description: 'Categoría encontrada.' })
  @ApiResponse({ status: 404, description: 'No se encontró la categoría con ese ID.' })
  findOne(@Param('id') id: string) {
    return this.categoriaService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una categoría por ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID de la categoría que se desea actualizar',
    required: true,
  })
  @ApiResponse({ status: 200, description: 'Categoría actualizada exitosamente.' })
  @ApiResponse({ status: 404, description: 'No se encontró la categoría para actualizar.' })
  update(@Param('id') id: string, @Body() dto: UpdateCategoriaDto) {
    return this.categoriaService.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una categoría por ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID de la categoría que se desea eliminar',
    required: true,
  })
  @ApiResponse({ status: 200, description: 'Categoría eliminada correctamente.' })
  @ApiResponse({ status: 404, description: 'No se encontró la categoría para eliminar.' })
  remove(@Param('id') id: string) {
    return this.categoriaService.remove(+id);
  }
}
