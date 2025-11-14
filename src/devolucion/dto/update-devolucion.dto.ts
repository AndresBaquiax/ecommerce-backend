import { PartialType } from '@nestjs/swagger';
import { CreateDevolucionDto } from './create-devolucion.dto';

import { IsInt, IsOptional, Min, IsString, IsNumber } from 'class-validator';

export class UpdateDevolucionDto {
  @IsOptional()
  @IsInt()
  id_pedido?: number;

  @IsOptional()
  @IsInt()
  id_usuario?: number;

  @IsOptional()
  @IsInt()
  id_inventario?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  cantidad?: number;

  @IsOptional()
  @IsString()
  motivo?: string;

  @IsOptional()
  @IsNumber()
  monto_reembolsado?: number;
}
