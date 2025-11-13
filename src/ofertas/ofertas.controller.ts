import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Put, 
  Param, 
  ParseIntPipe,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { OfertasService } from './ofertas.service';
import { CreateOfertaDto } from './dto/create-oferta.dto';
import { UpdateOfertaDto } from './dto/update-oferta.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@ApiTags('Ofertas')
@Controller('ofertas')
export class OfertasController {
  constructor(private readonly ofertasService: OfertasService) {}

  // ======================
  // 🔒 Requiere token (POST)
  // ======================
  @ApiOperation({ 
    summary: 'Crear oferta', 
    description: 'Crea una nueva oferta para un producto' 
  })
  @ApiResponse({ status: 201, description: 'Oferta creada exitosamente' })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createOfertaDto: CreateOfertaDto) {
    return this.ofertasService.create(createOfertaDto);
  }

  // ======================
  // � Requiere token (GET ALL)
  // ======================
  @ApiOperation({ 
    summary: 'Obtener todas las ofertas', 
    description: 'Devuelve una lista de todas las ofertas con sus productos' 
  })
  @ApiResponse({ status: 200, description: 'Lista de ofertas' })
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.ofertasService.findAll();
  }

  // ======================
  // � Requiere token (GET by ID)
  // ======================
  @ApiOperation({ 
    summary: 'Obtener oferta por ID', 
    description: 'Devuelve una oferta específica por su ID' 
  })
  @ApiParam({ name: 'id', description: 'ID de la oferta', example: 1 })
  @ApiResponse({ status: 200, description: 'Oferta encontrada' })
  @ApiResponse({ status: 404, description: 'Oferta no encontrada' })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ofertasService.findOne(id);
  }

  // ======================
  // 🔒 Requiere token (PUT)
  // ======================
  @ApiOperation({ 
    summary: 'Actualizar oferta', 
    description: 'Actualiza una oferta existente por su ID' 
  })
  @ApiParam({ name: 'id', description: 'ID de la oferta', example: 1 })
  @ApiResponse({ status: 200, description: 'Oferta actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Oferta no encontrada' })
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateOfertaDto: UpdateOfertaDto
  ) {
    return this.ofertasService.update(id, updateOfertaDto);
  }
}
