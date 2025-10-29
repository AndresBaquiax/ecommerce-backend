import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Proveedor } from 'src/proveedor/proveedor.entity';

@Entity('factura')
export class Factura {
  @PrimaryGeneratedColumn()
  id_factura: number;

  @Column({ type: 'text' })
  tipo: string;

  @Column({ type: 'date' })
  fecha: Date;

  @Column('numeric', { precision: 12, scale: 2 })
  subtotal: string;

  @Column('numeric', { precision: 12, scale: 2 })
  total: string;

  @Column('numeric', { precision: 5, scale: 2, nullable: true })
  descuento: string | null;

  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @ManyToOne(() => Proveedor, (proveedor) => proveedor.facturas, { nullable: false })
  @JoinColumn({ name: 'id_proveedor' })
  proveedor: Proveedor;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
