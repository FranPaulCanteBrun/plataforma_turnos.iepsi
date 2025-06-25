import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Usuario } from "./Usuario";

@Entity("notificaciones")
export class Notificacion {
  @PrimaryGeneratedColumn()
  id_notificacion!: number;

  @Column({ length: 50 })
  tipo!: string;

  @Column("text")
  contenido!: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  fecha_envio!: Date;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: "usuario_id" })
  usuario!: Usuario;
}
