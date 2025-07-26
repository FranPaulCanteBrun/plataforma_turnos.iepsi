import { Router } from "express";
import { verificarJWT } from "../middlewares/auth.middleware";
import { verificarRol } from "../middlewares/rol.middleware";
import {
  postPago,
  getPagos,
  getReportePagos,
  getResumenCaja,
} from "../controllers/pagos.controller";

const router = Router();

// Acceso exclusivo para administrativos
router.use(verificarJWT, verificarRol("administrativo"));

router.post("/", postPago); // Registrar pago
router.get("/", getPagos); // Listar todos
router.get("/reporte", getReportePagos); // Reporte por rango de fechas

router.get("/caja", getResumenCaja);

export default router;
