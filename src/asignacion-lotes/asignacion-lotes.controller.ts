import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { AsignacionLotesService } from './asignacion-lotes.service';
import { CreateAsignacionLoteDto } from './dto/create-asignacion-lote.dto';
import { UpdateAsignacionLoteDto } from './dto/update-asignacion-lote.dto';
import { AsignacionLotes } from './asignacion-lotes.entity';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@ApiTags('Asignación de Lotes')
@Controller('asignacion-lotes')
@UseGuards(JwtAuthGuard)
export class AsignacionLotesController {
  constructor(private readonly asignacionLotesService: AsignacionLotesService) {}

  @ApiOperation({ 
    summary: 'Crear asignación de lote', 
    description: 'Crea una nueva asignación de lote en el sistema.' 
  })
  @ApiBody({ type: CreateAsignacionLoteDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Asignación de lote creada exitosamente',
    schema: {
      type: 'object',
      properties: {
        id_asignacion: { type: 'number', example: 1 },
        id_inventario: { type: 'number', example: 1 },
        id_lote: { type: 'number', example: 1 },
        estado: { type: 'boolean', example: true },
        created_at: { type: 'string', format: 'date-time', example: '2025-07-29T12:00:00Z' },
        updated_at: { type: 'string', format: 'date-time', example: '2025-07-29T12:00:00Z' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @Post()
  async create(@Body() createAsignacionLoteDto: CreateAsignacionLoteDto): Promise<AsignacionLotes> {
    try {
      const result = await this.asignacionLotesService.create(createAsignacionLoteDto);
      return result;
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ 
    summary: 'Obtener todas las asignaciones de lotes', 
    description: 'Devuelve una lista de todas las asignaciones de lotes' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de asignaciones de lotes obtenida exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id_asignacion: { type: 'number', example: 1 },
          id_inventario: { type: 'number', example: 1 },
          id_lote: { type: 'number', example: 1 },
          estado: { type: 'boolean', example: true },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' }
        }
      }
    }
  })
  @Get()
  findAll(): Promise<AsignacionLotes[]> {
    return this.asignacionLotesService.findAll();
  }

  @ApiOperation({ 
    summary: 'Obtener asignación de lote por ID', 
    description: 'Devuelve una asignación de lote específica por su ID' 
  })
  @ApiParam({ name: 'id', description: 'ID de la asignación de lote', example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Asignación de lote encontrada exitosamente',
    schema: {
      type: 'object',
      properties: {
        id_asignacion: { type: 'number', example: 1 },
        id_inventario: { type: 'number', example: 1 },
        id_lote: { type: 'number', example: 1 },
        estado: { type: 'boolean', example: true },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Asignación de lote no encontrada' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<AsignacionLotes> {
    return this.asignacionLotesService.findOne(id);
  }

  @ApiOperation({ 
    summary: 'Actualizar asignación de lote', 
    description: 'Actualiza una asignación de lote existente por su ID.' 
  })
  @ApiParam({ name: 'id', description: 'ID de la asignación de lote', example: 1 })
  @ApiBody({ type: UpdateAsignacionLoteDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Asignación de lote actualizada exitosamente',
    schema: {
      type: 'object',
      properties: {
        id_asignacion: { type: 'number', example: 1 },
        id_inventario: { type: 'number', example: 2 },
        id_lote: { type: 'number', example: 2 },
        estado: { type: 'boolean', example: true },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Asignación de lote no encontrada' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAsignacionLoteDto: UpdateAsignacionLoteDto,
  ): Promise<AsignacionLotes> {
    return this.asignacionLotesService.update(id, updateAsignacionLoteDto);
  }

  @ApiOperation({ 
    summary: 'Alternar estado de asignación de lote', 
    description: 'Alterna el estado de la asignación de lote entre true y false' 
  })
  @ApiParam({ name: 'id', description: 'ID de la asignación de lote', example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Estado de asignación de lote alternado exitosamente',
    schema: {
      type: 'object',
      properties: {
        'estado actual': { type: 'boolean', example: true }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Asignación de lote no encontrada' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<{ "estado actual": boolean }> {
    return this.asignacionLotesService.remove(id);
  }
}
