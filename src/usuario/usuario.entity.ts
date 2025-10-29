import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany
} from 'typeorm';
import { Rol } from '../rol/rol.entity';
import { Usuarios } from 'src/usuarios/usuarios.entity';

@Entity('usuario')
export class Usuario {
  @PrimaryGeneratedColumn()
  id_usuario: number;

  @Column()
  nombre: string;

  @Column()
  contrasena_hash: string;

  @Column()
  telefono: string;

  @Column({ type: 'text', nullable: true })
  direccion: string | null;

  @Column()
  correo: string;

  @Column()
  estado: boolean;

  @Column()
  fecha_creacion: Date;

  @ManyToOne(() => Rol)
  @JoinColumn({ name: 'id_rol' })
  rol: Rol;

  @OneToMany(() => Usuarios, (rel) => rel.usuario)
  usuarios: Usuarios[];
}
