import { ApiProperty } from '@nestjs/swagger';

export class CreateDireccionDto {
  @ApiProperty({ example: '3a Calle' })
  calle: string;

  @ApiProperty({ example: 'Colonia Primavera' })
  colonia: string;

  @ApiProperty({ example: 'Guatemala' })
  ciudad: string;

  @ApiProperty({ example: true })
  estado: boolean;

  @ApiProperty({ example: 1 })
  id_usuario: number;

  @ApiProperty({ example: 2 })
  id_departamento: number;
}
