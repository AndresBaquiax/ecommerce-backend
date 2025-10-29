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

@ApiTags('Productos')
@Controller('productos')
@UseGuards(JwtAuthGuard)
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  private buildFullImageUrl(req: Request, url_imagen: string): string {
    if (!url_imagen) return '';
    
    // Si ya es una URL completa (http/https), devolverla tal como está
    if (url_imagen.startsWith('http://') || url_imagen.startsWith('https://')) {
      return url_imagen;
    }
    
    // Si es una ruta relativa, construir la URL completa
    const protocol = req.protocol;
    const host = req.get('host');
    return `${protocol}://${host}${url_imagen}`;
  }

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
  @ApiResponse({ 
    status: 201, 
    description: 'Producto creado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id_producto: { type: 'number', example: 1 },
        nombre: { type: 'string', example: 'Laptop Gaming' },
        descripcion: { type: 'string', example: 'Laptop para gaming con tarjeta gráfica dedicada' },
        precio_unitario: { type: 'number', example: 1500.99 },
        stock_minimo: { type: 'number', example: 5 },
        estado: { type: 'boolean', example: true },
        id_categoria: { type: 'number', example: 1 },
        url_imagen: { type: 'string', example: '/images/Laptop_Gaming.jpg' },
        created_at: { type: 'string', format: 'date-time', example: '2025-01-27T12:00:00Z' },
        updated_at: { type: 'string', format: 'date-time', example: '2025-01-27T12:00:00Z' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @UseInterceptors(FileInterceptor('imagen', multerConfig))
  @Post()
  async create(
    @Body() createProductoDto: CreateProductoDto,
    @UploadedFile() imagen?: Express.Multer.File
  ) {
    try {
      // Si se subió un archivo, usar la ruta del archivo para acceso web
      if (imagen) {
        createProductoDto.url_imagen = `/images/${imagen.filename}`;
      }
      
      const result = await this.productosService.create(createProductoDto);
      return result;
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ 
    summary: 'Obtener todos los productos', 
    description: 'Devuelve una lista de todos los productos' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de productos obtenida exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id_producto: { type: 'number', example: 1 },
          nombre: { type: 'string', example: 'Laptop Gaming' },
          descripcion: { type: 'string', example: 'Laptop para gaming' },
          precio_unitario: { type: 'number', example: 1500.99 },
          stock_minimo: { type: 'number', example: 5 },
          estado: { type: 'boolean', example: true },
          id_categoria: { type: 'number', example: 1 },
          url_imagen: { type: 'string', example: 'http://localhost:3000/images/Laptop_Gaming.jpg' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' }
        }
      }
    }
  })
  @Get()
  async findAll(@Req() req: Request) {
    const productos = await this.productosService.findAll();
    
    // Transformar las URLs de imagen a URLs completas
    return productos.map(producto => ({
      ...producto,
      url_imagen: this.buildFullImageUrl(req, producto.url_imagen)
    }));
  }

  @ApiOperation({ 
    summary: 'Obtener producto por ID', 
    description: 'Devuelve un producto específico por su ID' 
  })
  @ApiParam({ name: 'id', description: 'ID del producto', example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Producto encontrado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id_producto: { type: 'number', example: 1 },
        nombre: { type: 'string', example: 'Laptop Gaming' },
        descripcion: { type: 'string', example: 'Laptop para gaming' },
        precio_unitario: { type: 'number', example: 1500.99 },
        stock_minimo: { type: 'number', example: 5 },
        estado: { type: 'boolean', example: true },
        id_categoria: { type: 'number', example: 1 },
        url_imagen: { type: 'string', example: 'http://localhost:3000/images/Laptop_Gaming.jpg' },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const producto = await this.productosService.findOne(id);
    
    // Transformar la URL de imagen a URL completa
    return {
      ...producto,
      url_imagen: this.buildFullImageUrl(req, producto.url_imagen)
    };
  }

  @ApiOperation({ 
    summary: 'Actualizar producto', 
    description: 'Actualiza un producto existente por su ID. Puede recibir una imagen como archivo.' 
  })
  @ApiParam({ name: 'id', description: 'ID del producto', example: 1 })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nombre: { type: 'string', example: 'Laptop Gaming Actualizada' },
        descripcion: { type: 'string', example: 'Laptop para gaming actualizada' },
        precio_unitario: { type: 'number', example: 1600.99 },
        stock_minimo: { type: 'number', example: 3 },
        estado: { type: 'boolean', example: true },
        id_categoria: { type: 'number', example: 1 },
        url_imagen: { type: 'string', example: 'https://ejemplo.com/nueva-imagen.jpg' },
        imagen: { type: 'string', format: 'binary', description: 'Archivo de imagen (opcional)' }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Producto actualizado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id_producto: { type: 'number', example: 1 },
        nombre: { type: 'string', example: 'Laptop Gaming Actualizada' },
        descripcion: { type: 'string', example: 'Laptop para gaming actualizada' },
        precio_unitario: { type: 'number', example: 1600.99 },
        stock_minimo: { type: 'number', example: 3 },
        estado: { type: 'boolean', example: true },
        id_categoria: { type: 'number', example: 1 },
        url_imagen: { type: 'string', example: 'https://ejemplo.com/nueva-imagen.jpg' },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @UseInterceptors(FileInterceptor('imagen', multerConfig))
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateProductoDto: UpdateProductoDto,
    @UploadedFile() imagen?: Express.Multer.File
  ) {
    // Si se subió un archivo, usar la ruta del archivo
    if (imagen) {
      updateProductoDto.url_imagen = `/images/${imagen.filename}`;
    }
    
    return this.productosService.update(id, updateProductoDto);
  }

  @ApiOperation({ 
    summary: 'Alternar estado de producto', 
    description: 'Alterna el estado del producto entre true y false' 
  })
  @ApiParam({ name: 'id', description: 'ID del producto', example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Estado del producto alternado exitosamente',
    schema: {
      type: 'object',
      properties: {
        'estado actual': { type: 'boolean', example: true }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<{ "estado actual": boolean }> {
    return this.productosService.remove(id);
  }
}
