import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Factura } from 'src/factura/factura.entity';
import { Lotes } from 'src/lotes/lotes.entity';
import { Inventario } from 'src/inventario/inventario.entity';

@Entity('detalle_factura')
export class DetalleFactura {
  @PrimaryGeneratedColumn()
  id_detalle: number;

  @Column({ type: 'int' })
  cantidad: number;

  @Column('numeric', { precision: 12, scale: 2 })
  precio_unitario: number;

  @ManyToOne(() => Factura, (factura) => factura.id_factura, { nullable: false })
  @JoinColumn({ name: 'id_factura' })
  factura: Factura;

  @ManyToOne(() => Inventario, (inventario) => inventario.id_inventario, {
    nullable: false,
  })
  @JoinColumn({ name: 'id_inventario' })
  inventario: Inventario;

  @ManyToOne(() => Lotes, (lote) => lote.id_lote, { nullable: false })
  @JoinColumn({ name: 'id_lote' })
  lote: Lotes;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
