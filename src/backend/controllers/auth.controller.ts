import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { Usuario } from "../database/entities/Usuario";
import bcrypt from "bcrypt";
import { generarToken } from "../utils/jwt";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const repo = AppDataSource.getRepository(Usuario);
    const usuario = await repo.findOne({
      where: { email },
      relations: ["rol"],
    });

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    const token = generarToken({
      id: usuario.id_usuario,
      email: usuario.email,
      rol: usuario.rol.nombre,
    });

    res.status(200).json({
      mensaje: "Login exitoso",
      token,
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error: any) {
    console.error("Error en login: ", error);
    res.status(500).json({ mensaje: "Error al intentar iniciar sesion" });
  }
};
