import { Test, TestingModule } from '@nestjs/testing';
import { DepartamentoController } from './departamento.controller';
import { DepartamentoService } from './departamento.service';

describe('DepartamentoController', () => {
  let controller: DepartamentoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepartamentoController],
      providers: [
        {
          provide: DepartamentoService,
          useValue: {
            crear: jest.fn(),
            obtenerTodos: jest.fn(),
            obtenerPorId: jest.fn(),
            actualizar: jest.fn(),
            eliminarLogico: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DepartamentoController>(DepartamentoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
