import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { Producto } from './productos.entity';
import { Oferta } from 'src/ofertas/oferta.entity';
import { LocalStorageService } from './local-storage.service';

@Module({
  imports: [TypeOrmModule.forFeature([Producto, Oferta])],
  controllers: [ProductosController],
  providers: [ProductosService, LocalStorageService],
})
export class ProductosModule {}
