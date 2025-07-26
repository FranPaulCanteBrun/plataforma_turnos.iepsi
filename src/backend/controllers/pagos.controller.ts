import { Request, Response } from "express";
import {
  registrarPago,
  listarPagos,
  reportePagos,
  resumenCaja,
} from "../services/pago.service";

export const postPago = async (req: Request, res: Response) => {
  const { turno_id, monto, metodo } = req.body;
  try {
    const pago = await registrarPago(turno_id, monto, metodo);
    return res.status(201).json({ mensaje: "Pago registrado", pago });
  } catch (error: any) {
    console.error("Error al registrar pago:", error);
    return res.status(400).json({ mensaje: error.message });
  }
};

export const getPagos = async (_req: Request, res: Response) => {
  const pagos = await listarPagos();
  return res.status(200).json(pagos);
};

export const getReportePagos = async (req: Request, res: Response) => {
  const { desde, hasta } = req.query;
  try {
    const pagos = await reportePagos(
      new Date(desde as string),
      new Date(hasta as string)
    );
    return res.status(200).json(pagos);
  } catch (error: any) {
    return res.status(400).json({ mensaje: error.message });
  }
};

export const getResumenCaja = async (_req: Request, res: Response) => {
  try {
    const resumen = await resumenCaja();
    return res.status(200).json(resumen);
  } catch (error: any) {
    return res.status(400).json({ mensaje: error.message });
  }
};
