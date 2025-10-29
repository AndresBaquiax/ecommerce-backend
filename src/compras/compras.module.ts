import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComprasService } from './compras.service';
import { ComprasController } from './compras.controller';

import { Factura } from 'src/factura/factura.entity';
import { DetalleFactura } from 'src/detalle_factura/detalle_factura.entity';
import { Inventario } from 'src/inventario/inventario.entity';
import { Lotes } from 'src/lotes/lotes.entity';
import { AsignacionLotes } from 'src/asignacion-lotes/asignacion-lotes.entity';
import { Usuarios } from 'src/usuarios/usuarios.entity';
import { Usuario } from 'src/usuario/usuario.entity';
import { Proveedor } from 'src/proveedor/proveedor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Factura,
      DetalleFactura,
      Inventario,
      Lotes,
      AsignacionLotes,
      Usuarios,
      Usuario,
      Proveedor,
    ]),
  ],
  providers: [ComprasService],
  controllers: [ComprasController],
})
export class ComprasModule {}
