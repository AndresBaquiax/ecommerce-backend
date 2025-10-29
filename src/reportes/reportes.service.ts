import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Pedido } from 'src/pedidos/pedido.entity';
import { Factura } from 'src/factura/factura.entity';
import { Usuario } from 'src/usuario/usuario.entity';
import { Inventario } from 'src/inventario/inventario.entity';
import { Producto } from 'src/productos/productos.entity';
import { Categoria } from 'src/categorias/categoria.entity';
import { Rol } from 'src/rol/rol.entity';

const inicioDeSemana = (d = new Date()) => {
  const t = new Date(d);
  const dow = t.getDay();
  const diff = (dow + 6) % 7;
  t.setDate(t.getDate() - diff);
  t.setHours(0, 0, 0, 0);
  return t;
};

const finDeSemana = (d = new Date()) => {
  const s = inicioDeSemana(d);
  const e = new Date(s);
  e.setDate(s.getDate() + 7);
  e.setMilliseconds(-1);
  return e;
};

@Injectable()
export class ReportesService {
  constructor(
    @InjectRepository(Pedido) private readonly pedidoRepo: Repository<Pedido>,
    @InjectRepository(Factura) private readonly facturaRepo: Repository<Factura>,
    @InjectRepository(Usuario) private readonly usuarioRepo: Repository<Usuario>,
    @InjectRepository(Inventario) private readonly invRepo: Repository<Inventario>,
    @InjectRepository(Producto) private readonly prodRepo: Repository<Producto>,
    @InjectRepository(Categoria) private readonly catRepo: Repository<Categoria>,
    @InjectRepository(Rol) private readonly rolRepo: Repository<Rol>,
  ) {}

async resumen() {
  const ini = inicioDeSemana();
  const fin = finDeSemana();

  const iniPrev = new Date(ini);
  iniPrev.setDate(iniPrev.getDate() - 7);
  const finPrev = new Date(fin);
  finPrev.setDate(finPrev.getDate() - 7);

  const pct = (curr: number, prev: number) => {
    if (prev === 0) return curr > 0 ? 100 : 0;
    return Number((((curr - prev) / prev) * 100).toFixed(2));
  };

  const [{ total_venta_semana }] = await this.facturaRepo.manager.query(
    `SELECT COALESCE(SUM(total),0)::numeric AS total_venta_semana
     FROM factura
     WHERE UPPER(tipo) = 'VENTA'
       AND created_at BETWEEN $1 AND $2`,
    [ini, fin],
  );
  const [{ total_venta_semana_prev }] = await this.facturaRepo.manager.query(
    `SELECT COALESCE(SUM(total),0)::numeric AS total_venta_semana_prev
     FROM factura
     WHERE UPPER(tipo) = 'VENTA'
       AND created_at BETWEEN $1 AND $2`,
    [iniPrev, finPrev],
  );

  const [{ total_compra_semana }] = await this.facturaRepo.manager.query(
    `SELECT COALESCE(SUM(total),0)::numeric AS total_compra_semana
     FROM factura
     WHERE UPPER(tipo) = 'COMPRA'
       AND created_at BETWEEN $1 AND $2`,
    [ini, fin],
  );
  const [{ total_compra_semana_prev }] = await this.facturaRepo.manager.query(
    `SELECT COALESCE(SUM(total),0)::numeric AS total_compra_semana_prev
     FROM factura
     WHERE UPPER(tipo) = 'COMPRA'
       AND created_at BETWEEN $1 AND $2`,
    [iniPrev, finPrev],
  );

  const [{ new_users }] = await this.usuarioRepo.manager.query(
    `SELECT COUNT(*)::int AS new_users
     FROM usuario
     WHERE fecha_creacion BETWEEN $1 AND $2`,
    [ini, fin],
  );
  const [{ new_users_prev }] = await this.usuarioRepo.manager.query(
    `SELECT COUNT(*)::int AS new_users_prev
     FROM usuario
     WHERE fecha_creacion BETWEEN $1 AND $2`,
    [iniPrev, finPrev],
  );

  const [{ pendientes }] = await this.pedidoRepo.manager.query(
    `SELECT COUNT(*)::int AS pendientes
     FROM pedido
     WHERE estado = true`,
  );

  const venta = Number(total_venta_semana || 0);
  const ventaPrev = Number(total_venta_semana_prev || 0);
  const compra = Number(total_compra_semana || 0);
  const compraPrev = Number(total_compra_semana_prev || 0);
  const users = Number(new_users || 0);
  const usersPrev = Number(new_users_prev || 0);

  return {
    ventasSemanales: {
      total: venta,
      porcentaje: pct(venta, ventaPrev),
    },
    nuevosUsuarios: {
      total: users,
      porcentaje: pct(users, usersPrev),
    },
    comprasSemanales: {
      total: compra,
      porcentaje: pct(compra, compraPrev),
    },
    pedidosPendientesEntrega: {
      total: Number(pendientes || 0),
      porcentaje: 0,
    },
  };
}

async stockBajo() {
  const rows = await this.invRepo.manager.query(
    `SELECT 
        pr.id_producto,
        pr.nombre,
        COALESCE(pr.stock_minimo, 0)::int AS stock_minimo,
        i.id_inventario,
        i.cantidad::int AS cantidad,
        c.nombre AS categoria
     FROM inventario i
     JOIN producto  pr ON pr.id_producto  = i.id_producto
     LEFT JOIN categoria c ON c.id_categoria = pr.id_categoria
     WHERE i.estado = true
       AND COALESCE(pr.stock_minimo, 0) > 0
       AND i.cantidad <= pr.stock_minimo
     ORDER BY (pr.stock_minimo - i.cantidad) DESC, pr.nombre ASC`
  );

  return rows.map((r: any) => ({
    id_producto: Number(r.id_producto),
    id_inventario: Number(r.id_inventario),
    nombre: r.nombre as string,
    categoria: r.categoria as string | null,
    cantidad: Number(r.cantidad),
    stock_minimo: Number(r.stock_minimo),
  }));
}


  async ventasMensuales(year: number) {
    const ventas = await this.pedidoRepo.manager.query(
      `SELECT EXTRACT(MONTH FROM created_at)::int AS m,
              COALESCE(SUM(total),0)::numeric AS total
       FROM pedido
       WHERE EXTRACT(YEAR FROM created_at) = $1
       GROUP BY m
       ORDER BY m`,
      [year],
    );

    const compras = await this.facturaRepo.manager.query(
      `SELECT EXTRACT(MONTH FROM created_at)::int AS m,
              COALESCE(SUM(total),0)::numeric AS total
       FROM factura
       WHERE EXTRACT(YEAR FROM created_at) = $1
       GROUP BY m
       ORDER BY m`,
      [year],
    );

    const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    const aSerie = (rows: any[]) => {
      const map = new Map<number, number>(rows.map(r => [Number(r.m), Number(r.total)]));
      return meses.map((_, i) => map.get(i + 1) ?? 0);
    };

    return {
      categorias: meses,
      seriesVentas:  aSerie(ventas),
      seriesCompras: aSerie(compras),
    };
  }

  async stockPorCategoria() {
    const rows = await this.invRepo.manager.query(
      `SELECT c.nombre AS etiqueta,
              COALESCE(SUM(i.cantidad),0)::numeric AS valor
       FROM inventario i
       JOIN producto  pr ON pr.id_producto  = i.id_producto
       JOIN categoria c  ON c.id_categoria = pr.id_categoria
       GROUP BY c.nombre
       ORDER BY valor DESC`,
    );
    return rows.map((r: any) => ({ etiqueta: r.etiqueta, valor: Number(r.valor) }));
  }

  async topCategorias() {
    const rows = await this.facturaRepo.manager.query(
      `SELECT c.nombre AS etiqueta,
              COALESCE(SUM(df.cantidad * df.precio_unitario),0)::numeric AS valor
       FROM detalle_factura df
       JOIN inventario i  ON i.id_inventario = df.id_inventario
       JOIN producto  pr  ON pr.id_producto  = i.id_producto
       JOIN categoria c   ON c.id_categoria  = pr.id_categoria
       GROUP BY c.nombre
       ORDER BY valor DESC
       LIMIT 5`,
    );
    return rows.map((r: any) => ({ etiqueta: r.etiqueta, valor: Number(r.valor) }));
  }

  async timelinePedidos() {
    const rows = await this.pedidoRepo.manager.query(
      `SELECT id_pedido AS id, created_at AS fecha, total, estado
       FROM pedido
       ORDER BY created_at DESC
       LIMIT 8`,
    );
    return rows.map((r: any) => ({
      id: Number(r.id),
      titulo: `Pedido #${r.id} — Q${Number(r.total).toFixed(2)}`,
      fecha: r.fecha,
      tipo: r.estado ? 'enviado' : 'pendiente',
    }));
  }

  async usuariosPorRol() {
    const rows = await this.usuarioRepo.manager.query(
      `SELECT r.nombre AS etiqueta, COUNT(*)::int AS valor
       FROM usuario u
       JOIN rol r ON r.id_rol = u.id_rol
       GROUP BY r.nombre
       ORDER BY valor DESC`,
    );
    return rows.map((r: any) => ({ etiqueta: r.etiqueta, valor: Number(r.valor) }));
  }
}
