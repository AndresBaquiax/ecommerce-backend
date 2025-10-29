import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ProductoCompraDto {
  @IsPositive()
  id_inventario: number;

  @IsNumber()
  @IsPositive()
  cantidad: number;

  @IsNumber()
  @IsPositive()
  precio_unitario: number;

  @IsDateString()
  fecha_vencimiento: string;
}

export class RegistrarCompraDto {
  @IsString()
  @IsNotEmpty()
  tipo: string;

  @IsDateString()
  fecha: string;

  @IsNumber()
  @IsPositive()
  subtotal: number;

  @IsNumber()
  @IsPositive()
  total: number;

  @IsOptional()
  @IsNumber()
  descuento?: number;

  @IsPositive()
  id_proveedor: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductoCompraDto)
  detalleProductos: ProductoCompraDto[];
}
