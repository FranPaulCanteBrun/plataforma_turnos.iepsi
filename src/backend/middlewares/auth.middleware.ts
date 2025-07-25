
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secreto"; // Asegúrate de usar un valor seguro en producción

interface DecodedToken {
  id_usuario: number;
  rol: string;
}

export const verificarJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ mensaje: "Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

    const rolesPorNombre: Record<string, number> = {
      paciente: 1,
      profesional: 2,
      administrativo: 3,
    };

    (req as any).usuario = {
      id: decoded.id_usuario,
      id_usuario: decoded.id_usuario,
      rol: decoded.rol,
      rol_id: rolesPorNombre[decoded.rol],
    };

    next();
  } catch (error) {
    return res.status(403).json({ mensaje: "Token inválido" });
  }
};
