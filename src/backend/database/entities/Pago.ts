import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Turno } from "./Turno";

@Entity("pagos")
export class Pago {
  @PrimaryGeneratedColumn()
  id_pago!: number;

  @Column({ type: "numeric", precision: 10, scale: 2 })
  monto!: number;

  @Column({ length: 30 })
  metodo!: string; // efectivo, transferencia, QR

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  fecha!: Date;

  @ManyToOne(() => Turno)
  @JoinColumn({ name: "turno_id" })
  turno!: Turno;
}
