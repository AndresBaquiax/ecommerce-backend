import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Producto } from 'src/productos/productos.entity';

@Entity('oferta')
export class Oferta {
  @PrimaryGeneratedColumn()
  id_oferta: number;

  @Column('text', { nullable: true })
  descripcion: string;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  descuento_porcentaje: number;

  @Column('date')
  fecha_inicio: Date;

  @Column('date')
  fecha_fin: Date;

  @Column()
  id_producto: number;

  @ManyToOne(() => Producto)
  @JoinColumn({ name: 'id_producto' })
  producto: Producto;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
