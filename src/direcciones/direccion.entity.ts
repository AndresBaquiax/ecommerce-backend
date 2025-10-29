import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('direccion')
export class Direccion {
  @PrimaryGeneratedColumn()
  id_direccion: number;

  @Column()
  calle: string;

  @Column()
  colonia: string;

  @Column()
  ciudad: string;

  @Column()
  estado: boolean;

  @Column()
  id_usuario: number;

  @Column()
  id_departamento: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
