import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('departamento')
export class Departamento {
  @PrimaryGeneratedColumn()
  id_departamento: number;

  @Column({ type: 'text' })
  departamento: string;

  @Column({ default: true })
  estado: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
