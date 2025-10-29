import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { VentasService } from './ventas.service';
import { RegistrarVentaDto } from './dto/registrar-venta.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Ventas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Post()
  @ApiOperation({
    summary: 'Registrar una venta',
    description: 'Registra una venta incluyendo factura, detalle, asignaciones de lote, pedido y dirección.'
  })
  @ApiBody({
    type: RegistrarVentaDto,
    examples: {
      ejemplo1: {
        summary: 'Venta básica',
        value: {
          tipo: 'Venta',
          fecha: '2025-08-04',
          id_direccion: 1,
          productos: [
            {
              id_inventario: 3,
              cantidad: 25,
              precio_unitario: 18.50
            },
            {
              id_inventario: 4,
              cantidad: 10,
              precio_unitario: 22.75
            }
          ]
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Venta registrada exitosamente',
    schema: {
      type: 'object',
      properties: {
        mensaje: { type: 'string', example: 'Venta registrada exitosamente' },
        factura_id: { type: 'number', example: 12 },
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos o error en la venta' })
  @ApiResponse({ status: 401, description: 'No autorizado. JWT inválido o ausente' })
  @ApiResponse({ status: 404, description: 'Inventario, usuario o dirección no encontrada' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async registrarVenta(
    @Body() dto: RegistrarVentaDto,
    @Req() req: any,
  ) {
    const id_usuario = req.user.id_usuario;
    return this.ventasService.registrarVenta(dto, id_usuario);
  }
}
