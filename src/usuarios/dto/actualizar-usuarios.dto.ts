import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuariosDto } from './crear-usuarios.dto';

export class UpdateUsuariosDto extends PartialType(CreateUsuariosDto) {}
