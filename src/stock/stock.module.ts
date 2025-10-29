import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { Producto } from '../productos/productos.entity';
import { Inventario } from '../inventario/inventario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Producto, Inventario])],
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule {}
