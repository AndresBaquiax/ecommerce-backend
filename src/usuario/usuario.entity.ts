import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Rol } from '../rol/rol.entity';
import { Usuarios } from 'src/usuarios/usuarios.entity';
import { Logs } from 'src/logs/logs.entity';
import { EstadoCliente } from 'src/estado-cliente/estado-cliente.entity';

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

  @Column({ type: 'smallint', default: 2 })
  // DB currently stores this column as boolean (legacy schema). Keep entity in sync with DB
  // and map numeric states at service layer.
  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @Column()
  fecha_creacion: Date;

  @ManyToOne(() => Rol)
  @JoinColumn({ name: 'id_rol' })
  rol: Rol;

  @OneToMany(() => Usuarios, (rel) => rel.usuario)
  usuarios: Usuarios[];

  @OneToMany(() => Logs, (rel) => rel.id_log)
  logs: Logs[];

  @OneToOne(() => EstadoCliente, (ec) => ec.usuario, { cascade: false, eager: true })
  estadoCliente?: EstadoCliente;
}
