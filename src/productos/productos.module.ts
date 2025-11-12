import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { Producto } from './productos.entity';
import { GoogleDriveService } from './google-drive.service';
import { ImageProxyController } from './image-proxy.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Producto])],
  controllers: [ProductosController, ImageProxyController],
  providers: [ProductosService, GoogleDriveService],
})
export class ProductosModule {}
