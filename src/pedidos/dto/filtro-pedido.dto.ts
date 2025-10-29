import { IsOptional, IsBoolean, IsNumber, IsString } from 'class-validator';

export class FiltroPedidoDto {
  @IsOptional()
  @IsBoolean()
  estado?: boolean;

  @IsOptional()
  @IsNumber()
  id_usuario?: number;

  @IsOptional()
  @IsString()
  desde?: string;

  @IsOptional()
  @IsString()
  hasta?: string;
}
