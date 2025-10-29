import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateDetalleFacturaDto {
  @ApiProperty({ example: 5, description: 'Cantidad de productos vendidos' })
  @IsInt()
  @IsPositive()
  cantidad: number;

  @ApiProperty({ example: 150.75, description: 'Precio unitario del producto' })
  @IsNumber()
  @IsPositive()
  precio_unitario: number;

  @ApiProperty({ example: 1, description: 'ID de la factura relacionada' })
  @IsInt()
  @IsPositive()
  id_factura: number;

  @ApiProperty({ example: 3, description: 'ID del inventario relacionado' })
  @IsInt()
  @IsPositive()
  id_inventario: number;

  @ApiProperty({ example: 7, description: 'ID del lote del producto' })
  @IsInt()
  @IsPositive()
  id_lote: number;
}
