import { ApiProperty } from '@nestjs/swagger';

export class CreatePedidoDto {
  @ApiProperty({ example: '2025-08-01' })
  fecha_pedido: string;

  @ApiProperty({ example: 'Zona 1, Ciudad de Guatemala' })
  direccion_envio: string;

  @ApiProperty({ example: 15.00 })
  costo_envio: number;

  @ApiProperty({ example: 100.00 })
  subtotal: number;

  @ApiProperty({ example: 115.00 })
  total: number;

  @ApiProperty({ example: true })
  estado: boolean;

  @ApiProperty({ example: 1 })
  id_usuario: number;

  @ApiProperty({ example: 2 })
  id_factura: number;
}
