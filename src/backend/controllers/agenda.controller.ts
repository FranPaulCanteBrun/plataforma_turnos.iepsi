import { Request, Response } from "express";
import { obtenerAgendaProfesional } from "../services/agenda.service";

export const getAgenda = async (req: Request, res: Response) => {
  const usuario = (req as any).usuario;

  if (usuario.rol !== "profesional") {
    return res.status(403).json({ mensaje: "Acceso denegado" });
  }

  const { desde, hasta } = req.query;

  try {
    const agenda = await obtenerAgendaProfesional(
      usuario.id,
      desde ? new Date(desde as string) : undefined,
      hasta ? new Date(hasta as string) : undefined
    );
    return res.status(200).json(agenda);
  } catch (error: any) {
    console.error("Error al obtener agenda:", error);
    return res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};
