import { PartialType } from '@nestjs/mapped-types';
import { CreateDepartamentoDto } from './crear-departamento.dto';

export class UpdateDepartamentoDto extends PartialType(CreateDepartamentoDto) {}
