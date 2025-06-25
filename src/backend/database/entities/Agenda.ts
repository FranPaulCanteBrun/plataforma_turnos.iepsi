import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Usuario } from "./Usuario";

@Entity("agendas")
export class Agenda {
  @PrimaryColumn()
  id_agenda!: number;

  @Column({ type: "timestamp" })
  inicio!: Date;

  @Column({ type: "timestamp" })
  fin!: Date;

  @Column({ default: true })
  disponible!: boolean;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: "profesional_id" })
  profesional!: Usuario;
}
