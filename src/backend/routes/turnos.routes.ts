import { Router } from "express";
import { verificarJWT } from "../middlewares/auth.middleware";
import { verificarRol } from "../middlewares/rol.middleware";
import {
  getTurnos,
  postTurno,
  putTurno,
  deleteTurno,
} from "../controllers/turnos.controller";

const router = Router();

// Solo administrativos pueden asignar turnos
router.post("/", verificarJWT, verificarRol("administrativo"), postTurno);

router.get("/", verificarJWT, getTurnos); // depende el rol es la obtencion de turnos

router.put("/:id", verificarJWT, putTurno); // paciente o admin

router.delete("/:id", verificarJWT, deleteTurno); // paciente o admin

export default router;
