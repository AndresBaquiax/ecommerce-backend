import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventario } from './inventario.entity';
import { InventarioService } from './inventario.service';
import { InventarioController } from './inventario.controller';
import { Producto } from 'src/productos/productos.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Inventario, Producto])],
  controllers: [InventarioController],
  providers: [InventarioService],
})
export class InventarioModule {}
