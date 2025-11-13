import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateOfertaDto {
  @ApiProperty({ example: 'Oferta de Black Friday', description: 'Descripción de la oferta', required: false })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ example: 15, description: 'Porcentaje de descuento' })
  @IsNotEmpty()
  @IsNumber()
  descuento_porcentaje: number;

  @ApiProperty({ example: '2025-11-01', description: 'Fecha de inicio de la oferta' })
  @IsNotEmpty()
  @IsDateString()
  fecha_inicio: string;

  @ApiProperty({ example: '2025-11-30', description: 'Fecha de fin de la oferta' })
  @IsNotEmpty()
  @IsDateString()
  fecha_fin: string;

  @ApiProperty({ example: 1, description: 'ID del producto asociado' })
  @IsNotEmpty()
  @IsNumber()
  id_producto: number;
}
