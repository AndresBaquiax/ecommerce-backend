import { PartialType } from '@nestjs/swagger';
import { CreateProveedorDto } from './crear-proveedor.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, MaxLength, IsOptional } from 'class-validator';

export class UpdateProveedorDto extends PartialType(CreateProveedorDto) {
  @ApiPropertyOptional({ example: 'Nuevo Nombre Proveedor', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nombre?: string;

  @ApiPropertyOptional({ example: '+502 9999-9999', maxLength: 20 })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefono?: string;

  @ApiPropertyOptional({ example: '8765432-1', maxLength: 20 })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  nit?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  estado?: boolean;
}
