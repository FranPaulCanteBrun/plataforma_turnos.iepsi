import { Request, Response, NextFunction } from "express";

export const verificarRol = (rolPermitido: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const usuario = (req as any).usuario;

    if (!usuario || !usuario.rol) {
      return res
        .status(403)
        .json({ mensaje: "Acceso denegado: sin rol definido" });
    }

    if (usuario.rol !== rolPermitido) {
      return res
        .status(403)
        .json({ mensaje: "Acceso denegado: rol no autorizado" });
    }

    next();
  };
};
