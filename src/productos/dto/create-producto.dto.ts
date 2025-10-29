import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsInt,
  Min,
  MaxLength,
  IsUrl,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductoDto {
  @ApiProperty({
    example: 'Laptop Gaming',
    description: 'Nombre del producto',
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  nombre: string;

  @ApiProperty({
    example: 'Laptop para gaming con tarjeta gráfica dedicada y 16GB RAM',
    description: 'Descripción detallada del producto',
  })
  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @ApiProperty({
    example: 1500.99,
    description: 'Precio unitario del producto',
    minimum: 0,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  precio_unitario: number;

  @ApiProperty({
    example: 5,
    description: 'Stock mínimo requerido del producto',
    minimum: 0,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @ApiProperty({
    example: 5,
    description: 'Stock mínimo requerido del producto',
    minimum: 0,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  stock_minimo: number;

  @ApiProperty({
    example: 1,
    description: 'ID de la categoría a la que pertenece el producto',
  })
  @IsNotEmpty()
  @IsInt()
  id_categoria: number;

  @ApiProperty({
    example: 'https://ejemplo.com/imagen-laptop.jpg',
    description: 'URL de la imagen del producto (opcional si se sube archivo)',
    format: 'url',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  url_imagen?: string;
}
