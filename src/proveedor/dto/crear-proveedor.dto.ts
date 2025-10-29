import { IsString, IsBoolean, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProveedorDto {
  @ApiProperty({ example: 'Proveedor Ejemplo S.A.', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  nombre: string;

  @ApiProperty({ example: '+502 9999-9999', maxLength: 20 })
  @IsString()
  @MaxLength(20)
  telefono: string;

  @ApiProperty({ example: '87654321', maxLength: 20 })
  @IsString()
  @MaxLength(20)
  nit: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  estado: boolean;
}