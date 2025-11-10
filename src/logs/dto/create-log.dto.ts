import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsString,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLogDto {
    @ApiProperty({
        example: 'Usuario creado',
        description: 'Acción realizada en el sistema',
    })
    @IsNotEmpty()
    @IsString()
    accion: string;

    @ApiProperty({
        example: 1,
        description: 'ID del usuario que realiza la acción',
    })
    @IsNotEmpty()
    @IsNumber()
    id_usuario: number;
}
