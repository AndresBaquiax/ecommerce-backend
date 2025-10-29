import { PartialType } from '@nestjs/swagger';
import { CreateAsignacionLoteDto } from './create-asignacion-lote.dto';

export class UpdateAsignacionLoteDto extends PartialType(CreateAsignacionLoteDto) {}
