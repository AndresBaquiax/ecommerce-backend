import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsignacionLotesService } from './asignacion-lotes.service';
import { AsignacionLotesController } from './asignacion-lotes.controller';
import { AsignacionLotes } from './asignacion-lotes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AsignacionLotes])],
  controllers: [AsignacionLotesController],
  providers: [AsignacionLotesService],
  exports: [AsignacionLotesService]
})
export class AsignacionLotesModule {}
