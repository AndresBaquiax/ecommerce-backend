import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartamentoController } from './departamento.controller';
import { DepartamentoService } from './departamento.service';
import { Departamento } from './departamento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Departamento])],
  controllers: [DepartamentoController],
  providers: [DepartamentoService],
  exports: [DepartamentoService],
})
export class DepartamentoModule {}
