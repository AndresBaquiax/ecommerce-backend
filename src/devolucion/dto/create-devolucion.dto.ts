import { IsInt, IsNotEmpty, IsOptional, Min, IsString, IsNumber } from 'class-validator';

export class CreateDevolucionDto {
  @IsInt()
  id_pedido: number;

  @IsInt()
  id_usuario: number;

  @IsOptional()
  @IsInt()
  id_inventario?: number;

  @IsInt()
  @Min(1)
  cantidad: number;

  @IsString()
  @IsNotEmpty()
  motivo: string;

  @IsOptional()
  @IsNumber()
  monto_reembolsado?: number;
}
