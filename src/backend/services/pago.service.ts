import { AppDataSource } from "../database/data-source";
import { Pago } from "../database/entities/Pago";
import { Turno } from "../database/entities/Turno";

export const registrarPago = async (
  turno_id: number,
  monto: number,
  metodo: string
): Promise<Pago> => {
  const pagoRepo = AppDataSource.getRepository(Pago);
  const turnoRepo = AppDataSource.getRepository(Turno);

  const turno = await turnoRepo.findOneBy({ id_turno: turno_id });
  if (!turno) throw new Error("Turno no encontrado");

  if (turno.estado === "cancelado")
    throw new Error("No se puede pagar un turno cancelado");

  const nuevoPago = pagoRepo.create({ turno, monto, metodo });
  const pagoGuardado = await pagoRepo.save(nuevoPago);

  // marcar turno como pagado
  turno.estado = "pagado";
  await turnoRepo.save(turno);

  return pagoGuardado;
};

export const listarPagos = async () => {
  const pagoRepo = AppDataSource.getRepository(Pago);
  return pagoRepo.find({
    relations: ["turno", "turno.paciente", "turno.profesional"],
    order: { fecha: "DESC" },
  });
};

export const reportePagos = async (desde: Date, hasta: Date) => {
  const pagoRepo = AppDataSource.getRepository(Pago);
  return pagoRepo
    .createQueryBuilder("pago")
    .where("pago.fecha BETWEEN :desde AND :hasta", { desde, hasta })
    .leftJoinAndSelect("pago.turno", "turno")
    .leftJoinAndSelect("turno.paciente", "paciente")
    .leftJoinAndSelect("turno.profesional", "profesional")
    .orderBy("pago.fecha", "ASC")
    .getMany();
};

export const resumenCaja = async () => {
  const pagoRepo = AppDataSource.getRepository(Pago);

  const hoy = new Date();
  const inicioDia = new Date(hoy);
  inicioDia.setHours(0, 0, 0, 0);

  const inicioSemana = new Date(hoy);
  inicioSemana.setDate(hoy.getDate() - 6);
  inicioSemana.setHours(0, 0, 0, 0);

  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

  const [dia, semana, mes] = await Promise.all([
    pagoRepo
      .createQueryBuilder("pago")
      .select("SUM(pago.monto)", "total")
      .where("pago.fecha >= :inicio", { inicio: inicioDia })
      .getRawOne(),

    pagoRepo
      .createQueryBuilder("pago")
      .select("SUM(pago.monto)", "total")
      .where("pago.fecha >= :inicio", { inicio: inicioSemana })
      .getRawOne(),

    pagoRepo
      .createQueryBuilder("pago")
      .select("SUM(pago.monto)", "total")
      .where("pago.fecha >= :inicio", { inicio: inicioMes })
      .getRawOne(),
  ]);

  return {
    dia: Number(dia.total || 0),
    semana: Number(semana.total || 0),
    mes: Number(mes.total || 0),
  };
};
