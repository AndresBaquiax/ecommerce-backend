// ...existing code...
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Check,
} from 'typeorm';
import { Usuario } from 'src/usuario/usuario.entity';
import { Inventario } from 'src/inventario/inventario.entity';
import { Pedido } from 'src/pedidos/pedido.entity';
import { DetalleFactura } from 'src/detalle_factura/detalle_factura.entity';

@Entity('devolucion')
export class Devolucion {
  @PrimaryGeneratedColumn()
  id_devolucion: number;

  @ManyToOne(() => Pedido)
  @JoinColumn({ name: 'id_pedido'})
  pedido: Pedido;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario'})
  usuario: Usuario;

  @ManyToOne(() => DetalleFactura)
  @JoinColumn({ name: 'id_detalle'})
  detalle?: DetalleFactura | null;

  @ManyToOne(() => Inventario)
  @JoinColumn({ name: 'id_inventario'})
  inventario?: Inventario | null;

  @Column()
  cantidad: number;

  @Column()
  motivo: string;

  @Column()
  fecha_solicitud: Date;

  @Column()
  fecha_resolucion?: Date;

  @Column()
  monto_reembolsado: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
