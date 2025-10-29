import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { Inventario } from 'src/inventario/inventario.entity';
import { Lotes } from 'src/lotes/lotes.entity';

@Entity('asigna_lotes')
export class AsignacionLotes {
  @PrimaryGeneratedColumn()
  id_asignacion: number;

  @ManyToOne(() => Inventario, { nullable: false })
  @JoinColumn({ name: 'id_inventario' }) // <- usa la FK real
  inventario: Inventario;

  @ManyToOne(() => Lotes, { nullable: false })
  @JoinColumn({ name: 'id_lote' })       // <- usa la FK real
  lote: Lotes;

  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
