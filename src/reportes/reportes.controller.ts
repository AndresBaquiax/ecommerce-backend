import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { ReportesService } from './reportes.service';
import { ApiOperation } from '@nestjs/swagger';

@ApiTags('Reportes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reportes')
export class ReportesController {
  constructor(private readonly svc: ReportesService) {}

  @Get('resumen')
  resumen() {
    return this.svc.resumen();
  }

  @Get('ventas-mensuales')
  ventasMensuales(@Query('anio') anio?: string) {
    return this.svc.ventasMensuales(Number(anio) || new Date().getFullYear());
  }

  @Get('stock-por-categoria')
  stockPorCategoria() {
    return this.svc.stockPorCategoria();
  }

  @Get('top-categorias')
  topCategorias() {
    return this.svc.topCategorias();
  }

  @Get('timeline-pedidos')
  timelinePedidos() {
    return this.svc.timelinePedidos();
  }

  @Get('usuarios-por-rol')
  usuariosPorRol() {
    return this.svc.usuariosPorRol();
  }

  @Get('stock-bajo')
  @ApiOperation({ summary: 'Productos con stock por debajo o igual al mínimo' })
  stockBajo() {
    return this.svc.stockBajo();
}
}
