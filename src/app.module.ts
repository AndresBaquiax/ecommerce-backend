import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AuthModule } from './auth/auth.module';
import { UsuarioModule } from './usuario/usuario.module';
import { UsuarioModule as RegisterModule } from './register/register.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ProductosModule } from './productos/productos.module';
import { LotesModule } from './lotes/lotes.module';
import { AsignacionLotesModule } from './asignacion-lotes/asignacion-lotes.module';
import { ProveedorModule } from './proveedor/proveedor.module';
import { FacturaModule } from './factura/factura.module';
import { DetalleFacturaModule } from './detalle_factura/detalle_factura.module';
import { InventarioModule } from './inventario/inventario.module';
import { CategoriasModule } from './categorias/categorias.module';
import { PedidoModule } from './pedidos/pedido.module';
import { DireccionModule } from './direcciones/direccion.module';
import { ComprasModule } from './compras/compras.module';
import { StockModule } from './stock/stock.module';
import { DepartamentoModule } from './departamentos/departamento.module';

// Entidades
import { Usuario } from './usuario/usuario.entity';
import { RegisterUsuario } from './register/register.entity';
import { Usuarios } from './usuarios/usuarios.entity';
import { Rol } from './rol/rol.entity';
import { Producto } from './productos/productos.entity';
import { Lotes } from './lotes/lotes.entity';
import { AsignacionLotes } from './asignacion-lotes/asignacion-lotes.entity';
import { Proveedor } from './proveedor/proveedor.entity';
import { Factura } from './factura/factura.entity';
import { DetalleFactura } from './detalle_factura/detalle_factura.entity';
import { Inventario } from './inventario/inventario.entity';
import { Categoria } from './categorias/categoria.entity';
import { VentasModule } from './ventas/ventas.module';
import { Direccion } from './direcciones/direccion.entity';
import { Pedido } from './pedidos/pedido.entity';
import { Departamento } from './departamentos/departamento.entity';
import { RolModule } from './rol/rol.module';
import { ReportesModule } from './reportes/reportes.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'src', 'img'),
      serveRoot: '/images',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: parseInt(config.get<string>('DB_PORT') || '5432', 10),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [
          Usuario,
          RegisterUsuario,
          Usuarios,
          Rol,
          Proveedor,
          Factura,
          DetalleFactura,
          Inventario,
          Lotes,
          Producto,
          Categoria,
          AsignacionLotes,
          Direccion,
          Pedido,
          Departamento
        ],
        synchronize: false,
      }),
    }),
    UsuarioModule,
    CategoriasModule,
    RegisterModule,
    UsuariosModule,
    ProductosModule,
    LotesModule,
    AsignacionLotesModule,
    ProveedorModule,
    FacturaModule,
    DetalleFacturaModule,
    InventarioModule,
    ComprasModule,
    AuthModule,
    VentasModule,
    DireccionModule,
    PedidoModule,
    StockModule,
    DepartamentoModule,
    RolModule,
    ReportesModule 
  ],
})
export class AppModule {}
