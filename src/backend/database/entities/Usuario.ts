import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Rol } from "./Rol";

@Entity("usuarios")
export class Usuario {
  @PrimaryGeneratedColumn()
  id_usuario!: number;

  @Column({ unique: true, length: 20 })
  dni!: string;

  @Column({ length: 100 })
  nombre!: string;

  @Column({ length: 100 })
  apellido!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ default: true })
  activo!: boolean;

  @ManyToOne(() => Rol, (rol) => rol.usuarios)
  @JoinColumn({ name: "rol_id" })
  rol!: Rol;
}
