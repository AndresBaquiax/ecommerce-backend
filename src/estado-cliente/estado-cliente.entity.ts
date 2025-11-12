import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from 'src/usuario/usuario.entity';

@Entity('estado_cliente')
export class EstadoCliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  id_usuario: number;

  @OneToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @Column({ type: 'smallint', default: 2 })
  estado: number;

  @Column({ type: 'timestamp with time zone', default: () => 'now()' })
  updated_at: Date;
}
