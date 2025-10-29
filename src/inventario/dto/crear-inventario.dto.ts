import { IsInt, IsBoolean, IsPositive } from 'class-validator';

export class CreateInventarioDto {
  @IsInt()
  @IsPositive()
  cantidad: number;

  @IsInt()
  @IsPositive()
  id_producto: number;

  @IsBoolean()
  estado: boolean;
}
