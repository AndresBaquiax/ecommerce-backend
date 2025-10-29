import { PartialType } from '@nestjs/mapped-types';
import { CreateFacturaDto } from './crear-factura.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class UpdateFacturaDto extends PartialType(CreateFacturaDto) {
  @ApiPropertyOptional({ example: 2, description: 'Nuevo ID de proveedor (opcional)' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  id_proveedor?: number;
}
