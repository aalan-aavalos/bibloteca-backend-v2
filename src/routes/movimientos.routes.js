import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { createMovimientoSchema } from "../schemas/movimientos.schema.js";
import { crearMovimiento, listMovimientos, kardex } from "../services/movimientos.service.js";

const r = Router();

r.post("/", validate(createMovimientoSchema), async (req, res, next) => {
    try {
        const mov = await crearMovimiento(req.data.body);
        res.status(201).json(mov);
    } catch (e) { next(e); }
});

r.get("/", async (req, res, next) => {
    try {
        const data = await listMovimientos(req.query);
        res.json(data);
    } catch (e) { next(e); }
});

r.get("/kardex/:productoId", async (req, res, next) => {
    try {
        const { productoId } = req.params;
        const { desde, hasta } = req.query;
        const data = await kardex(productoId, desde, hasta);
        res.json(data);
    } catch (e) { next(e); }
});

export default r;