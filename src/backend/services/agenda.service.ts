import { AppDataSource } from "../database/data-source";
import { Turno } from "../database/entities/Turno";

export const obtenerAgendaProfesional = async (
  id_profesional: number,
  desde?: Date,
  hasta?: Date
): Promise<Turno[]> => {
  const repo = AppDataSource.getRepository(Turno);

  const query = repo
    .createQueryBuilder("turno")
    .leftJoinAndSelect("turno.paciente", "paciente")
    .where("turno.profesional_id = :id", { id: id_profesional })
    .andWhere("turno.estado != 'cancelado'");

  if (desde) query.andWhere("turno.fecha_hora >= :desde", { desde });
  if (hasta) query.andWhere("turno.fecha_hora <= :hasta", { hasta });

  return query.orderBy("turno.fecha_hora", "ASC").getMany();
};
