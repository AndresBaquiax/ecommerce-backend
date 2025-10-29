import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Producto } from 'src/productos/productos.entity';
import { DetalleFactura } from 'src/detalle_factura/detalle_factura.entity';
import { AsignacionLotes } from 'src/asignacion-lotes/asignacion-lotes.entity';

@Entity('inventario')
export class Inventario {
  @PrimaryGeneratedColumn()
  id_inventario: number;

  @Column('int')
  cantidad: number;

  @Column()
  estado: boolean;

  @Column()
  id_producto: number;

  @ManyToOne(() => Producto, (producto) => producto.inventarios)
  @JoinColumn({ name: 'id_producto' })
  producto: Producto;

  @OneToMany(() => DetalleFactura, (detalle) => detalle.inventario)
  detalles_factura: DetalleFactura[];

  @OneToMany(() => AsignacionLotes, (asignacion) => asignacion.inventario)
  asignaciones_lote: AsignacionLotes[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}