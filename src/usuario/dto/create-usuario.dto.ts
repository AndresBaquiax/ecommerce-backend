import { IsString, IsEmail, IsBoolean, IsOptional, IsInt, MinLength } from 'class-validator';

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
  @IsBoolean()
  estado?: boolean;

  @IsInt()
  id_rol: number;
}
