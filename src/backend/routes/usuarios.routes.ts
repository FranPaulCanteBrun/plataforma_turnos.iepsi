import { Router } from "express";
import { verificarJWT } from "../middlewares/auth.middleware";
import { verificarRol } from "../middlewares/rol.meddleware";
import {
  borrarUsuario,
  crearUsuario,
  listarUsuarios,
  actualizarUsuario,
} from "../controllers/usuarios.controller";

const router = Router();

// Solo Admin puede listar todos los usuarios
router.get("/", verificarJWT, verificarRol("administrativo"), listarUsuarios);

router.post("/", crearUsuario);

router.put(
  "/:id",
  verificarJWT,
  verificarRol("administrativo"),
  actualizarUsuario
);

router.delete(
  "/:id",
  verificarJWT,
  verificarRol("administrativo"),
  borrarUsuario
);

export default router;
