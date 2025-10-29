import { IsInt, IsPositive } from 'class-validator';

export class CreateUsuariosDto {
  @IsInt()
  @IsPositive()
  id_usuario: number;

  @IsInt()
  @IsPositive()
  id_factura: number;
}
