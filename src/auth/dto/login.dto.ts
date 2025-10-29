import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ 
    example: 'usuario@example.com', 
    description: 'Correo electrónico del usuario',
    format: 'email'
  })
  @IsEmail()
  correo: string;

  @ApiProperty({
    example: '123456',
    description: 'Contraseña del usuario',
    minLength: 6
  })
  @IsString()
  contrasena: string;
}
