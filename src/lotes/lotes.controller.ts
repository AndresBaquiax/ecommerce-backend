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
import { LotesService } from './lotes.service';
import { CreateLoteDto } from './dto/create-lote.dto';
import { UpdateLoteDto } from './dto/update-lote.dto';
import { Lotes } from './lotes.entity';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@ApiTags('Lotes')
@Controller('lotes')
@UseGuards(JwtAuthGuard)
export class LotesController {
  constructor(private readonly lotesService: LotesService) {}

  @ApiOperation({ 
    summary: 'Crear lote', 
    description: 'Crea un nuevo lote en el sistema.' 
  })
  @ApiBody({ type: CreateLoteDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Lote creado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id_lote: { type: 'number', example: 1 },
        fecha_vencimiento: { type: 'string', format: 'date', example: '2025-12-31' },
        cantidad: { type: 'number', example: 100 },
        estado: { type: 'boolean', example: true },
        created_at: { type: 'string', format: 'date-time', example: '2025-01-27T12:00:00Z' },
        updated_at: { type: 'string', format: 'date-time', example: '2025-01-27T12:00:00Z' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @Post()
  async create(@Body() createLoteDto: CreateLoteDto): Promise<Lotes> {
    try {
      const result = await this.lotesService.create(createLoteDto);
      return result;
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ 
    summary: 'Obtener todos los lotes', 
    description: 'Devuelve una lista de todos los lotes' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de lotes obtenida exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id_lote: { type: 'number', example: 1 },
          fecha_vencimiento: { type: 'string', format: 'date', example: '2025-12-31' },
          cantidad: { type: 'number', example: 100 },
          estado: { type: 'boolean', example: true },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' }
        }
      }
    }
  })
  @Get()
  findAll(): Promise<Lotes[]> {
    return this.lotesService.findAll();
  }

  @ApiOperation({ 
    summary: 'Obtener lote por ID', 
    description: 'Devuelve un lote específico por su ID' 
  })
  @ApiParam({ name: 'id', description: 'ID del lote', example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Lote encontrado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id_lote: { type: 'number', example: 1 },
        fecha_vencimiento: { type: 'string', format: 'date', example: '2025-12-31' },
        cantidad: { type: 'number', example: 100 },
        estado: { type: 'boolean', example: true },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Lote no encontrado' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Lotes> {
    return this.lotesService.findOne(id);
  }

  @ApiOperation({ 
    summary: 'Actualizar lote', 
    description: 'Actualiza un lote existente por su ID.' 
  })
  @ApiParam({ name: 'id', description: 'ID del lote', example: 1 })
  @ApiBody({ type: UpdateLoteDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Lote actualizado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id_lote: { type: 'number', example: 1 },
        fecha_vencimiento: { type: 'string', format: 'date', example: '2026-01-31' },
        cantidad: { type: 'number', example: 150 },
        estado: { type: 'boolean', example: true },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiOperation({ 
    summary: 'Actualizar lote', 
    description: 'Actualiza un lote existente por su ID' 
  })
  @ApiParam({ name: 'id', description: 'ID del lote', example: 1 })
  @ApiBody({ type: UpdateLoteDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Lote actualizado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id_lote: { type: 'number', example: 1 },
        fecha_vencimiento: { type: 'string', format: 'date', example: '2026-01-31' },
        cantidad: { type: 'number', example: 150 },
        estado: { type: 'boolean', example: true },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Lote no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLoteDto: UpdateLoteDto,
  ): Promise<Lotes> {
    return this.lotesService.update(id, updateLoteDto);
  }

  @ApiOperation({ 
    summary: 'Alternar estado de lote', 
    description: 'Alterna el estado del lote entre true y false' 
  })
  @ApiParam({ name: 'id', description: 'ID del lote', example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Estado del lote alternado exitosamente',
    schema: {
      type: 'object',
      properties: {
        'estado actual': { type: 'boolean', example: true }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Lote no encontrado' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<{ "estado actual": boolean }> {
    return this.lotesService.remove(id);
  }
}
