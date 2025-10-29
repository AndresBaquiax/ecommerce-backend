import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ProductoVentaDto {
  @IsPositive()
  id_inventario: number;

  @IsNumber()
  @IsPositive()
  cantidad: number;

  @IsNumber()
  @IsPositive()
  precio_unitario: number;
}

export class RegistrarVentaDto {
  @IsString()
  @IsNotEmpty()
  tipo: string;

  @IsDateString()
  fecha: string;

  @IsPositive()
  id_direccion: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductoVentaDto)
  productos: ProductoVentaDto[];
}
