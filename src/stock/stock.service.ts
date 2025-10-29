import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from '../productos/productos.entity';
import { Inventario } from '../inventario/inventario.entity';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
    @InjectRepository(Inventario)
    private inventarioRepository: Repository<Inventario>,
  ) {}

  async getProductosConEstadoStock() {
    // Obtener productos con su inventario
    const productos = await this.productoRepository.find({
      relations: ['inventarios'],
      where: { estado: true },
    });

    // Mapear productos con estado de stock
    const productosConEstado = productos.map((producto) => {
      // Calcular stock total del producto sumando todo el inventario
      const stockTotal = producto.inventarios
        .filter(inventario => inventario.estado === true)
        .reduce((total, inventario) => total + inventario.cantidad, 0);

      // Determinar estado del stock
      let estadoStock = 'alto';
      if (stockTotal === 0) {
        estadoStock = 'bajo';
      } else if (stockTotal <= producto.stock_minimo) {
        estadoStock = 'medio';
      }

      return {
        id_producto: producto.id_producto,
        nombre: producto.nombre,
        stock_actual: stockTotal,
        stock_minimo: producto.stock_minimo,
        estado_stock: estadoStock,
      };
    });

    // Ordenar por prioridad: bajo -> medio -> alto
    productosConEstado.sort((a, b) => {
      const prioridad = { bajo: 1, medio: 2, alto: 3 };
      return prioridad[a.estado_stock] - prioridad[b.estado_stock];
    });

    return productosConEstado;
  }
}
