import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { Usuario } from "../database/entities/Usuario";
import bcrypt from "bcrypt";

export const listarUsuarios = async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Usuario);
    const usuarios = await repo.find();
    res.status(200).json(usuarios);
  } catch (error) {
    console.error("Error al listar usuarios: ", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

export const crearUsuario = async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Usuario);
    if (!req.body.password) {
      return res.status(400).json({ mensaje: "La contraseña es obligatoria" });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const nuevoUsuario = repo.create({ ...req.body, password: hashedPassword });
    const resultado = await repo.save(nuevoUsuario);
    res.status(201).json(resultado);
  } catch (error) {
    console.error("Error al crear usuario: ", error);
    res.status(500).json({ mensaje: "Error al registrar usuario" });
  }
};

export const borrarUsuario = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  try {
    const repo = AppDataSource.getRepository(Usuario);
    const usuario = await repo.findOneBy({ id_usuario: id });

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    await repo.remove(usuario);
    res.status(200).json({ mensaje: "Usuario eliminado con exito" });
  } catch (error) {
    console.error("Error al borrar usuario: ", error);
    res.status(500).json({ mensaje: "Error al eliminar usuario" });
  }
};

export const actualizarUsuario = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  try {
    const repo = AppDataSource.getRepository(Usuario);
    const usuario = await repo.findOneBy({ id_usuario: id });

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    if (req.body.email) {
      const usuarioConEseEmail = await repo.findOneBy({
        email: req.body.email,
      });

      if (usuarioConEseEmail && usuarioConEseEmail.id_usuario !== id) {
        return res
          .status(400)
          .json({ mensaje: "El email ya está en uso por otro usuario" });
      }
    }

    if (req.body.dni) {
      const usuarioConEseDni = await repo.findOneBy({ dni: req.body.dni });
      if (usuarioConEseDni && usuarioConEseDni.id_usuario !== id) {
        return res
          .status(400)
          .json({ mensaje: "El DNI ya está registrado en otro usuario" });
      }
    }

    repo.merge(usuario, req.body);
    const resultado = await repo.save(usuario);

    res.status(200).json(resultado);
  } catch (error: any) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({
      mensaje: "Error al actualizar usuario",
      detalle: error.message,
    });
  }
};

export const listarProfesionales = async (_req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Usuario);
    const profesionales = await repo.find({
      where: { rol: { id: 2 }, activo: true },
    });
    res.json(profesionales);
  } catch (error) {
    console.error("Error al listar profesionales:", error);
    res.status(500).json({ mensaje: "Error al obtener profesionales" });
  }
};
