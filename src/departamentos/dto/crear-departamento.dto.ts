import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateDepartamentoDto {
  @IsString()
  @IsNotEmpty()
  departamento: string;

  @IsOptional()
  @IsBoolean()
  estado?: boolean;
}
