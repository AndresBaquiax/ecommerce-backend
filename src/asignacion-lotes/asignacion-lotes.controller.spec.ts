import { Test, TestingModule } from '@nestjs/testing';
import { AsignacionLotesController } from './asignacion-lotes.controller';
import { AsignacionLotesService } from './asignacion-lotes.service';

describe('AsignacionLotesController', () => {
  let controller: AsignacionLotesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AsignacionLotesController],
      providers: [AsignacionLotesService],
    }).compile();

    controller = module.get<AsignacionLotesController>(AsignacionLotesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
