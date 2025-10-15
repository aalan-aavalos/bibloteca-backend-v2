import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { createProductoSchema, updateProductoSchema } from "../schemas/productos.schema.js";
import { prisma } from "../prisma.js";
import { productosStockBajoRaw } from "../services/productos.stockbajo.raw.js";

const r = Router();

r.post("/", validate(createProductoSchema), async (req, res, next) => {
    try {
        const p = await prisma.producto.create({ data: req.data.body });
        res.status(201).json(p);
    } catch (e) { next(e); }
});

r.get("/", async (req, res, next) => {
    try {
        const { q, categoria, page = 1, pageSize = 20 } = req.query;
        const list = await prisma.producto.findMany({
            where: {
                AND: [
                    q ? { OR: [{ codigo: { contains: q, mode: "insensitive" } }, { nombre: { contains: q, mode: "insensitive" } }] } : {},
                    categoria ? { categoria } : {}
                ]
            },
            skip: (Number(page) - 1) * Number(pageSize),
            take: Number(pageSize),
            orderBy: { actualizadoEn: "desc" }
        });
        res.json(list);
    } catch (e) { next(e); }
});

r.get("/alertas", async (_req, res, next) => {
    try {
        const rows = await productosStockBajoRaw();
        res.json(rows);
    } catch (e) { next(e); }
});

r.get(":id", async (req, res, next) => {
    try {
        const p = await prisma.producto.findUnique({ where: { id: BigInt(req.params.id) } });
        if (!p) return res.status(404).json({ message: "No encontrado" });
        res.json(p);
    } catch (e) { next(e); }
});

r.put(":id", validate(updateProductoSchema), async (req, res, next) => {
    try {
        const p = await prisma.producto.update({ where: { id: BigInt(req.params.id) }, data: req.data.body });
        res.json(p);
    } catch (e) { next(e); }
});

export default r;