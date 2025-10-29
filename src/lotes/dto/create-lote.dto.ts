import { IsNotEmpty, IsDateString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLoteDto {
  @ApiProperty({ description: 'Fecha de vencimiento del lote', example: '2025-12-31' })
  @IsNotEmpty()
  @IsDateString()
  fecha_vencimiento: string;

  @ApiProperty({ description: 'Cantidad del lote', example: 100 })
  @IsNotEmpty()
  @IsInt()
  cantidad: number;
}
