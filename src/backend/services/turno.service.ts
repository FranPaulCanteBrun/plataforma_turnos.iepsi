import { AppDataSource } from "../database/data-source";
import { Turno } from "../database/entities/Turno";
import { Usuario } from "../database/entities/Usuario";
import { logNotificacion } from "./notificacion.service";

export const crearTurno = async (
  fecha_hora: Date,
  paciente_id: number,
  profesional_id: number
): Promise<Turno> => {
  const turnoRepo = AppDataSource.getRepository(Turno);
  const usuarioRepo = AppDataSource.getRepository(Usuario);

  const paciente = await usuarioRepo.findOneBy({ id_usuario: paciente_id });
  const profesional = await usuarioRepo.findOneBy({
    id_usuario: profesional_id,
  });

  if (!paciente || !profesional) {
    throw new Error("Paciente o profesional no encontrados");
  }

  const nuevoTurno = turnoRepo.create({
    fecha_hora,
    paciente,
    profesional,
    estado: "pendiente",
  });

  const turnoGuardado = await turnoRepo.save(nuevoTurno);

  await logNotificacion(
    "turno_confirmado",
    `Hola ${paciente.nombre}, tu turno con ${profesional.nombre} ${
      profesional.apellido
    } fue confirmado para el ${fecha_hora.toLocaleString()}.`,
    paciente
  );

  return turnoGuardado;
};

export const listarTurnosPorRol = async (usuario: any): Promise<Turno[]> => {
  const turnoRepo = AppDataSource.getRepository(Turno);

  if (usuario.rol === "administrativo") {
    return await turnoRepo.find({
      relations: ["paciente", "profesional"],
      order: { fecha_hora: "ASC" },
    });
  }

  if (usuario.rol === "paciente") {
    return await turnoRepo.find({
      where: { paciente: { id_usuario: usuario.id } },
      relations: ["paciente", "profesional"],
      order: { fecha_hora: "ASC" },
    });
  }

  if (usuario.rol === "profesional") {
    return await turnoRepo.find({
      where: { profesional: { id_usuario: usuario.id } },
      relations: ["paciente", "profesional"],
      order: { fecha_hora: "ASC" },
    });
  }

  throw new Error("Rol no reconocido");
};

// Reprogramar turno
export const reprogramarTurno = async (
  id_turno: number,
  nuevaFecha: Date,
  usuario: any
): Promise<Turno> => {
  const repo = AppDataSource.getRepository(Turno);
  const turno = await repo.findOne({
    where: { id_turno },
    relations: ["paciente"],
  });

  if (!turno) throw new Error("Turno no encontrado");

  const esDueño = turno.paciente.id_usuario === usuario.id;
  const esAdmin = usuario.rol === "administrativo";

  if (!esDueño && !esAdmin) {
    throw new Error("No autorizado para modificar este turno");
  }

  turno.fecha_hora = nuevaFecha;
  return await repo.save(turno);
};

// Cancelar turno
export const cancelarTurno = async (
  id_turno: number,
  usuario: any
): Promise<Turno> => {
  const repo = AppDataSource.getRepository(Turno);
  const turno = await repo.findOne({
    where: { id_turno },
    relations: ["paciente", "profesional"],
  });

  if (!turno) throw new Error("Turno no encontrado");

  const esDueño = turno.paciente.id_usuario === usuario.id;
  const esAdmin = usuario.rol === "administrativo";

  if (!esDueño && !esAdmin) {
    throw new Error("No autorizado para cancelar este turno");
  }

  turno.estado = "cancelado";
  const turnoCancelado = await repo.save(turno);

  // Enviar notificación al paciente
  await logNotificacion(
    "turno_cancelado",
    `Hola ${turno.paciente.nombre}, tu turno con ${turno.profesional.nombre} ${
      turno.profesional.apellido
    } del ${turno.fecha_hora.toLocaleString()} ha sido cancelado.`,
    turno.paciente
  );

  return turnoCancelado;
};

export const crearTurnoComoPaciente = async (
  fecha_hora: Date,
  paciente_id: number,
  profesional_id: number
) => {
  const repo = AppDataSource.getRepository(Turno);

  if (!fecha_hora || !profesional_id) {
    throw new Error("Faltan datos obligatorios");
  }

  const nuevoTurno = repo.create({
    fecha_hora,
    estado: "pendiente",
    paciente: { id_usuario: paciente_id },
    profesional: { id_usuario: profesional_id },
  });

  return await repo.save(nuevoTurno);
};
