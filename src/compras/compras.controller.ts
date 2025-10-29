import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { ComprasService } from './compras.service';
import { RegistrarCompraDto } from './dto/registrar-compra.dto';

@ApiTags('Compras')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('compras')
export class ComprasController {
  constructor(private readonly comprasService: ComprasService) {}

  @Post()
  @ApiOperation({
    summary: 'Registrar compra',
    description: 'Registra una nueva compra incluyendo detalles de productos, lotes y actualización de inventario.',
  })
  @ApiBody({
    type: RegistrarCompraDto,
    examples: {
      ejemplo1: {
        summary: 'Ejemplo de compra',
        value: {
          tipo: "Compra",
          fecha: "2025-08-04",
          subtotal: 1000.00,
          total: 950.00,
          descuento: 50.00,
          id_proveedor: 2,
          detalleProductos: [
            {
              id_inventario: 1,
              cantidad: 10,
              precio_unitario: 100.00,
              fecha_vencimiento: "2026-01-01"
            },
            {
              id_inventario: 2,
              cantidad: 5,
              precio_unitario: 120.00,
              fecha_vencimiento: "2026-06-01"
            }
          ]
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Compra registrada exitosamente',
    schema: {
      type: 'object',
      properties: {
        mensaje: {
          type: 'string',
          example: 'Compra registrada exitosamente',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async registrarCompra(
    @Body() dto: RegistrarCompraDto,
    @Req() req: Request,
  ) {
    const usuario = req.user as { id_usuario: number; rol: string };
    return this.comprasService.registrarCompra(dto, usuario.id_usuario);
  }
}
