import { PartialType } from '@nestjs/mapped-types';
import { CreateDetalleFacturaDto } from './crear-detalle-factura.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive, IsNumber } from 'class-validator';

export class UpdateDetalleFacturaDto extends PartialType(CreateDetalleFacturaDto) {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  id_factura?: number;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  id_inventario?: number;

  @ApiPropertyOptional({ example: 7 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  id_lote?: number;

  @ApiPropertyOptional({ example: 99.99 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  precio_unitario?: number;
}
