import { Request, Response, NextFunction } from "express";

// 1 = paciente, 2 = profesional, 3 = administrativo
const rolesPorNombre: { [key: string]: number } = {
  paciente: 1,
  profesional: 2,
  administrativo: 3,
};

export const verificarRol = (rolPermitido: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const usuario = (req as any).usuario;

    if (!usuario || !usuario.rol_id) {
      return res
        .status(403)
        .json({ mensaje: "Acceso denegado: sin rol definido" });
    }

    const nombreRol =
      usuario.rol_id === 1
        ? "paciente"
        : usuario.rol_id === 2
        ? "profesional"
        : usuario.rol_id === 3
        ? "administrativo"
        : null;

    if (nombreRol !== rolPermitido) {
      return res
        .status(403)
        .json({ mensaje: "Acceso denegado: rol no autorizado" });
    }

    next();
  };
};
