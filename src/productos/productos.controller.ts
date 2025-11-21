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
  UseInterceptors,
  UploadedFile,
  Req
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiConsumes } from '@nestjs/swagger';
import { Request } from 'express';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { multerConfig } from './multer.config';
import { LocalStorageService } from './local-storage.service';

@ApiTags('Productos')
@Controller('productos')
export class ProductosController {
  constructor(
    private readonly productosService: ProductosService,
    private readonly localStorageService: LocalStorageService,
  ) {}

  private buildFullImageUrl(req: Request, url_imagen: string): string {
    if (!url_imagen) return '';
    
    const protocol = req.protocol;
    const host = req.get('host');
    const baseUrl = `${protocol}://${host}`;
    
    // Si ya es una URL completa local (/uploads/...), devolverla con base URL
    if (url_imagen.startsWith('/uploads/')) {
      return `${baseUrl}${url_imagen}`;
    }
    
    // Si es URL externa, devolverla tal cual
    if (url_imagen.startsWith('http://') || url_imagen.startsWith('https://')) {
      return url_imagen;
    }
    
    // Si es una ruta relativa del backend
    return `${baseUrl}${url_imagen}`;
  }

  // ======================
  // 🔒 Requiere token (POST)
  // ======================
  @ApiOperation({ 
    summary: 'Crear producto', 
    description: 'Crea un nuevo producto en el sistema. Puede recibir una imagen como archivo o una URL.' 
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nombre: { type: 'string', example: 'Laptop Gaming' },
        descripcion: { type: 'string', example: 'Laptop para gaming con tarjeta gráfica dedicada' },
        precio_unitario: { type: 'number', example: 1500.99 },
        stock_minimo: { type: 'number', example: 5 },
        id_categoria: { type: 'number', example: 1 },
        url_imagen: { type: 'string', example: 'https://ejemplo.com/imagen.jpg' },
        imagen: { type: 'string', format: 'binary', description: 'Archivo de imagen (opcional)' }
      }
    }
  })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('imagen', multerConfig))
  @Post()
  async create(
    @Body() createProductoDto: CreateProductoDto,
    @UploadedFile() imagen?: Express.Multer.File
  ) {
    if (imagen) {
      // Guardar la imagen localmente
      const url = await this.localStorageService.uploadFile(
        imagen.buffer,
        imagen.originalname
      );
      createProductoDto.url_imagen = url;
    }
    return this.productosService.create(createProductoDto);
  }

  // ======================
  // 🟢 NO requiere token (GET ALL)
  // ======================
  @ApiOperation({ 
    summary: 'Obtener todos los productos', 
    description: 'Devuelve una lista de todos los productos' 
  })
  @Get()
  async findAll(@Req() req: Request) {
    const productos = await this.productosService.findAll();
    return productos.map(producto => ({
      ...producto,
      url_imagen: this.buildFullImageUrl(req, producto.url_imagen)
    }));
  }

  // ======================
  // 🟢 NO requiere token (GET by ID)
  // ======================
  @ApiOperation({ 
    summary: 'Obtener producto por ID', 
    description: 'Devuelve un producto específico por su ID' 
  })
  @ApiParam({ name: 'id', description: 'ID del producto', example: 1 })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const producto = await this.productosService.findOne(id);
    return {
      ...producto,
      url_imagen: this.buildFullImageUrl(req, producto.url_imagen)
    };
  }

  // ======================
  // 🔒 Requiere token (PUT)
  // ======================
  @ApiOperation({ 
    summary: 'Actualizar producto', 
    description: 'Actualiza un producto existente por su ID. Puede recibir una imagen como archivo.' 
  })
  @ApiParam({ name: 'id', description: 'ID del producto', example: 1 })
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('imagen', multerConfig))
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateProductoDto: UpdateProductoDto,
    @UploadedFile() imagen?: Express.Multer.File,
    @Req() req?: Request
  ) {
    if (imagen) {
      // Guardar la imagen localmente
      const url = await this.localStorageService.uploadFile(
        imagen.buffer,
        imagen.originalname
      );
      updateProductoDto.url_imagen = url;
    }
    const productoActualizado = await this.productosService.update(id, updateProductoDto);
    
    // Transformar la URL de la imagen para el response si hay request
    if (req) {
      return {
        ...productoActualizado,
        url_imagen: this.buildFullImageUrl(req, productoActualizado.url_imagen)
      };
    }
    
    return productoActualizado;
  }

  // ======================
  // 🔒 Requiere token (DELETE)
  // ======================
  @ApiOperation({ 
    summary: 'Alternar estado de producto', 
    description: 'Alterna el estado del producto entre true y false' 
  })
  @ApiParam({ name: 'id', description: 'ID del producto', example: 1 })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<{ "estado actual": boolean }> {
    return this.productosService.remove(id);
  }
}
