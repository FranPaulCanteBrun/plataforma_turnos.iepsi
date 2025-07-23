import { Router } from "express";
import { verificarJWT } from "../middlewares/auth.middleware";
import { getAgenda } from "../controllers/agenda.controller";

const router = Router();

router.get("/", verificarJWT, getAgenda); // solo profesional accede

export default router;
