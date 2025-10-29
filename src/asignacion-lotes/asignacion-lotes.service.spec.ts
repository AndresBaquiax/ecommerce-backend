import { Test, TestingModule } from '@nestjs/testing';
import { AsignacionLotesService } from './asignacion-lotes.service';

describe('AsignacionLotesService', () => {
  let service: AsignacionLotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AsignacionLotesService],
    }).compile();

    service = module.get<AsignacionLotesService>(AsignacionLotesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
