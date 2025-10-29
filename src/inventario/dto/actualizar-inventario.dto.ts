import { IsOptional, IsInt, IsBoolean, IsPositive } from 'class-validator';

export class UpdateInventarioDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  cantidad?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  id_producto?: number;

  @IsOptional()
  @IsBoolean()
  estado?: boolean;
}
