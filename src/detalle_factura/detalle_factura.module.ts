import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleFactura } from './detalle_factura.entity';
import { DetalleFacturaService } from './detalle_factura.service';
import { DetalleFacturaController } from './detalle_factura.controller';
import { Factura } from 'src/factura/factura.entity';
import { Inventario } from 'src/inventario/inventario.entity';
import { Lotes } from 'src/lotes/lotes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DetalleFactura, Factura, Inventario, Lotes]),
  ],
  controllers: [DetalleFacturaController],
  providers: [DetalleFacturaService],
  exports: [DetalleFacturaService],
})
export class DetalleFacturaModule {}
