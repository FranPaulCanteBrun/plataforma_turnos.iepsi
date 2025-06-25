import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Usuario } from "./Usuario";

@Entity("turnos")
export class Turno {
  @PrimaryGeneratedColumn()
  id_turno!: number;

  @Column({ type: "timestamp" })
  fecha_hora!: Date;

  @Column({ length: 30, default: "pendiente" })
  estado!: string;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: "paciente_id" })
  paciente!: Usuario;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: "profesional_id" })
  profesional!: Usuario;
}
