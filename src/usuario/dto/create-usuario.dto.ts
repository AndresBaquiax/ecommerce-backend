import { IsString, IsEmail, IsOptional, MinLength, IsInt, IsIn } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  nombre: string;

  @IsString()
  @MinLength(6)
  contrasena: string;

  @IsString()
  telefono: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsEmail()
  correo: string;

  @IsOptional()
  @IsInt()
  @IsIn([0, 1, 2, 3, 4])
  estado?: number;

  @IsInt()
  id_rol: number;
}
