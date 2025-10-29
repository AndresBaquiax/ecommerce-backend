import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('pedido')
export class Pedido {
  @PrimaryGeneratedColumn()
  id_pedido: number;

  @Column({ type: 'date' })
  fecha_pedido: string;

  @Column('text')
  direccion_envio: string;

  @Column('numeric')
  costo_envio: number;

  @Column('numeric')
  subtotal: number;

  @Column('numeric')
  total: number;

  @Column()
  estado: boolean;

  @Column()
  id_usuario: number;

  @Column()
  id_factura: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
