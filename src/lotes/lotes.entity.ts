import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { AsignacionLotes } from 'src/asignacion-lotes/asignacion-lotes.entity';

@Entity('lote')
export class Lotes {
  @PrimaryGeneratedColumn()
  id_lote: number;

  @Column({ type: 'date', nullable: false })
  fecha_vencimiento: Date;

  @Column({ type: 'integer', nullable: false })
  cantidad: number;

  @Column({ type: 'boolean', nullable: false })
  estado: boolean;

  @OneToMany(() => AsignacionLotes, (asignacion) => asignacion.lote)
  asignaciones_lote: AsignacionLotes[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}