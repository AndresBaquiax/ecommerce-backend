import {
  Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { UsuariosService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/actualizar-usuario.dto';

@ApiTags('Usuarios')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('usuario')
export class UsuarioController {
  constructor(private readonly service: UsuariosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear usuario' })
  @ApiBody({ type: CreateUsuarioDto })
  crear(@Body() dto: CreateUsuarioDto) {
    return this.service.crear(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar usuarios' })
  obtenerTodos() {
    return this.service.obtenerTodos();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  @ApiParam({ name: 'id', example: 1 })
  obtenerPorId(@Param('id', ParseIntPipe) id: number) {
    return this.service.obtenerPorId(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar usuario' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({ type: UpdateUsuarioDto })
  actualizar(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUsuarioDto) {
    return this.service.actualizar(id, dto);
  }

  @Patch('eliminar/:id')
  @ApiOperation({ summary: 'Eliminar (lógico) usuario' })
  @ApiParam({ name: 'id', example: 1 })
  eliminarLogico(@Param('id', ParseIntPipe) id: number) {
    return this.service.eliminarLogico(id);
  }
}
