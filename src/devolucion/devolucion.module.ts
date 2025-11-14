import { Module } from '@nestjs/common';
import { DevolucionService } from './devolucion.service';
import { DevolucionController } from './devolucion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Devolucion } from './entities/devolucion.entity';
import { Pedido } from 'src/pedidos/pedido.entity';
import { Usuario } from 'src/usuario/usuario.entity';
import { DetalleFactura } from 'src/detalle_factura/detalle_factura.entity';
import { Inventario } from 'src/inventario/inventario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    Devolucion, Pedido, Usuario, DetalleFactura, Inventario
  ])],
  providers: [DevolucionService],
  controllers: [DevolucionController],
  exports: [DevolucionService],
})
export class DevolucionModule {}
