import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DepartamentoService } from './departamento.service';
import { Departamento } from './departamento.entity';

describe('DepartamentoService', () => {
  let service: DepartamentoService;
  let repository: Repository<Departamento>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepartamentoService,
        {
          provide: getRepositoryToken(Departamento),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DepartamentoService>(DepartamentoService);
    repository = module.get<Repository<Departamento>>(getRepositoryToken(Departamento));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
