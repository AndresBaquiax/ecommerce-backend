import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';
import { IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
  @IsString() @MinLength(6) @IsOptional()
  contrasena?: string;

  @IsInt() @IsOptional()
  id_rol?: number;
}
