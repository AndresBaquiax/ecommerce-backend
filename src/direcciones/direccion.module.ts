import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Direccion } from './direccion.entity';
import { DireccionController } from './direccion.controller';
import { DireccionService } from './direccion.service';

@Module({
  imports: [TypeOrmModule.forFeature([Direccion])],
  controllers: [DireccionController],
  providers: [DireccionService],
  exports: [DireccionService],
})
export class DireccionModule {}
