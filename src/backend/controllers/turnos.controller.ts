import { Request, Response } from "express";
import {
  crearTurno,
  listarTurnosPorRol,
  cancelarTurno,
  reprogramarTurno,
  crearTurnoComoPaciente,
} from "../services/turno.service";

export const postTurno = async (req: Request, res: Response) => {
  const { fecha_hora, paciente_id, profesional_id } = req.body;

  try {
    const turno = await crearTurno(
      new Date(fecha_hora),
      paciente_id,
      profesional_id
    );
    return res.status(201).json({ mensaje: "Turno creado", turno });
  } catch (error: any) {
    console.error("Error al crear turno:", error);
    return res.status(400).json({ mensaje: error.message });
  }
};

export const getTurnos = async (req: Request, res: Response) => {
  try {
    const usuario = (req as any).usuario;
    const turnos = await listarTurnosPorRol(usuario);
    return res.status(200).json(turnos);
  } catch (error: any) {
    console.error("Error al listar turnos:", error);
    return res.status(400).json({ mensaje: error.message });
  }
};

export const putTurno = async (req: Request, res: Response) => {
  const id_turno = parseInt(req.params.id);
  const { fecha_hora } = req.body;
  const usuario = (req as any).usuario;

  try {
    const actualizado = await reprogramarTurno(
      id_turno,
      new Date(fecha_hora),
      usuario
    );
    return res
      .status(200)
      .json({ mensaje: "Turno reprogramado", turno: actualizado });
  } catch (error: any) {
    console.error("Error al reprogramar:", error);
    return res.status(400).json({ mensaje: error.message });
  }
};

export const deleteTurno = async (req: Request, res: Response) => {
  const id_turno = parseInt(req.params.id);
  const usuario = (req as any).usuario;

  try {
    const cancelado = await cancelarTurno(id_turno, usuario);
    return res
      .status(200)
      .json({ mensaje: "Turno cancelado", turno: cancelado });
  } catch (error: any) {
    console.error("Error al cancelar:", error);
    return res.status(400).json({ mensaje: error.message });
  }
};

export const postTurnoPaciente = async (req: Request, res: Response) => {
  const usuario = (req as any).usuario;
  const { fecha_hora, profesional_id } = req.body;

  try {
    const turno = await crearTurnoComoPaciente(
      new Date(fecha_hora),
      usuario.id_usuario,
      profesional_id
    );
    return res.status(201).json({ mensaje: "Turno solicitado", turno });
  } catch (error: any) {
    console.error("Error al crear turno como paciente:", error);
    return res.status(400).json({ mensaje: error.message });
  }
};
