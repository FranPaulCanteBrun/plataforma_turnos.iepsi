import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const CLAVE_SECRETA = "tu_clave_secreta";

export const verificarJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ mensaje: "Acceso denegado: token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, CLAVE_SECRETA) as {
      id_usuario: number;
      rol: string;
    };

    // Asignamos el usuario con rol en texto plano
    (req as any).usuario = {
      id_usuario: decoded.id_usuario,
      rol: decoded.rol, // esto es un string como "paciente"
    };

    next();
  } catch (error) {
    return res.status(403).json({ mensaje: "Token inválido" });
  }
};
