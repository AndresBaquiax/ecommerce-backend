import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFacturaDto {
  @ApiProperty({ example: 'Compra', description: 'Tipo de factura (Compra/Venta)' })
  @IsString()
  @IsNotEmpty()
  tipo: string;

  @ApiProperty({ example: '2025-08-04', description: 'Fecha de emisión de la factura' })
  @IsDateString()
  fecha: string;

  @ApiProperty({ example: 1000.00, description: 'Subtotal de la factura' })
  @IsNumber()
  @IsPositive()
  subtotal: number;

  @ApiProperty({ example: 950.00, description: 'Total de la factura' })
  @IsNumber()
  @IsPositive()
  total: number;

  @ApiProperty({ example: 50.00, description: 'Descuento aplicado (opcional)', required: false })
  @IsOptional()
  @IsNumber()
  descuento?: number;

  @ApiProperty({ example: true, description: 'Estado de la factura' })
  @IsBoolean()
  estado: boolean;

  @ApiProperty({ example: 1, description: 'ID del proveedor asociado' })
  @IsNumber()
  @IsPositive()
  id_proveedor: number;
}
