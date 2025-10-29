import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReportesService } from './reportes.service';
import { ReportesController } from './reportes.controller';

import { Pedido } from 'src/pedidos/pedido.entity';
import { Factura } from 'src/factura/factura.entity';
import { Usuario } from 'src/usuario/usuario.entity';
import { Inventario } from 'src/inventario/inventario.entity';
import { Producto } from 'src/productos/productos.entity';
import { Categoria } from 'src/categorias/categoria.entity';
import { Rol } from 'src/rol/rol.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Pedido,
      Factura,
      Usuario,
      Inventario,
      Producto,
      Categoria,
      Rol,
    ]),
  ],
  controllers: [ReportesController],
  providers: [ReportesService],
})
export class ReportesModule {}
