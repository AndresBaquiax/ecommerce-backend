import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';
import { CreateProductoDto } from './create-producto.dto';

export class UpdateProductoDto extends PartialType(CreateProductoDto) {
  @ApiPropertyOptional({
    example: 'Laptop Gaming Actualizada',
    description: 'Nombre del producto',
    maxLength: 100,
  })
  nombre: string;

  @ApiPropertyOptional({
    example: 'Laptop para gaming actualizada con mejores especificaciones',
    description: 'Descripción detallada del producto',
  })
  descripcion: string;

  @ApiPropertyOptional({
    example: 1600.99,
    description: 'Precio unitario del producto',
    minimum: 0,
  })
  precio_unitario: number;

  @ApiPropertyOptional({
    example: 3,
    description: 'Stock mínimo requerido del producto',
    minimum: 0,
  })
  stock_minimo: number;

  @ApiPropertyOptional({
    example: false,
    description: 'Estado activo/inactivo del producto',
  })
  @IsOptional()
  @IsBoolean()
  estado: boolean;

  @ApiPropertyOptional({
    example: 2,
    description: 'ID de la categoría a la que pertenece el producto',
  })
  id_categoria: number;

  @ApiPropertyOptional({
    example: 'https://ejemplo.com/nueva-imagen-laptop.jpg',
    description: 'URL de la imagen del producto (opcional)',
    format: 'url',
  })
  url_imagen: string;
}
