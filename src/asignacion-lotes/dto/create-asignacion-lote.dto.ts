import { IsNotEmpty, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAsignacionLoteDto {
  @ApiProperty({ description: 'ID del inventario', example: 1 })
  @IsNotEmpty()
  @IsInt()
  id_inventario: number;

  @ApiProperty({ description: 'ID del lote', example: 1 })
  @IsNotEmpty()
  @IsInt()
  id_lote: number;
}
