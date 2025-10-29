import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VentasService } from './ventas.service';
import { VentasController } from './ventas.controller';

import { Factura } from 'src/factura/factura.entity';
import { DetalleFactura } from 'src/detalle_factura/detalle_factura.entity';
import { Inventario } from 'src/inventario/inventario.entity';
import { Lotes } from 'src/lotes/lotes.entity';
import { Pedido } from 'src/pedidos/pedido.entity';
import { Direccion } from 'src/direcciones/direccion.entity';
import { Usuario } from 'src/usuario/usuario.entity';
import { Usuarios } from 'src/usuarios/usuarios.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Factura,
      DetalleFactura,
      Inventario,
      Lotes,
      Pedido,
      Direccion,
      Usuario,
      Usuarios,
    ]),
  ],
  controllers: [VentasController],
  providers: [VentasService],
})
export class VentasModule {}
