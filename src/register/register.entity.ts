import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';

@Entity('usuario')
export class RegisterUsuario {
  @PrimaryGeneratedColumn()
  id_usuario: number;


  @Column()
  nombre: string;

  @Column({ name: 'contrasena_hash' })
  contrasenaHash: string;

  @Column()
  telefono: string;

  @Column({ nullable: true })
  direccion: string;

  @Column()
  correo: string;

  @Column()
  estado: boolean;

  @Column({ name: 'fecha_creacion', type: 'timestamp' })
  fechaCreacion: Date;

  @Column()
  id_rol: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
