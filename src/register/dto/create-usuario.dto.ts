import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsString,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUsuarioDto2 {
  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre completo del usuario',
  })
  @IsNotEmpty()
  @IsString()
  nombre!: string;

  @ApiProperty({
    example: 'miContrasena123',
    description: 'Contraseña del usuario (mínimo 6 caracteres)',
    minLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  contrasena!: string;

  @ApiProperty({
    example: '+502 1234-5678',
    description: 'Número de teléfono del usuario',
  })
  @IsNotEmpty()
  @IsString()
  telefono!: string;

  @ApiProperty({
    example: 'Ciudad de Guatemala, Guatemala',
    description: 'Dirección del usuario (opcional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiProperty({
    example: 'usuario@example.com',
    description: 'Correo electrónico del usuario',
    format: 'email',
  })
  @IsEmail()
  @IsNotEmpty()
  correo!: string;

  @ApiProperty({
    example: 2,
    description: 'ID del rol asignado al usuario (1: Admin, 2: Cliente)',
  })
  @IsNotEmpty()
  @IsNumber()
  id_rol!: number;
}