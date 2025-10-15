import { Router } from "express";
import { prisma } from "../prisma.js";
const r = Router();

r.post("/", async (req, res, next) => {
    try {
        const row = await prisma.proveedor.create({ data: req.body });
        res.status(201).json(row);
    } catch (e) { next(e); }
});

r.get("/", async (_req, res, next) => {
    try {
        res.json(await prisma.proveedor.findMany({ orderBy: { actualizadoEn: "desc" } }));
    } catch (e) { next(e); }
});

r.get(":id", async (req, res, next) => {
    try {
        const row = await prisma.proveedor.findUnique({ where: { id: BigInt(req.params.id) } });
        if (!row) return res.status(404).json({ message: "No encontrado" });
        res.json(row);
    } catch (e) { next(e); }
});

r.put(":id", async (req, res, next) => {
    try {
        const row = await prisma.proveedor.update({ where: { id: BigInt(req.params.id) }, data: req.body });
        res.json(row);
    } catch (e) { next(e); }
});

export default r;