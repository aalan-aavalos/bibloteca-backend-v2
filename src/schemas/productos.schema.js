import { z } from "zod";


export const createProductoSchema = z.object({
    body: z.object({
        codigo: z.string().min(1),
        nombre: z.string().min(1),
        descripcion: z.string().optional(),
        categoria: z.string().optional(),
        unidad: z.string().min(1),
        stockMinimo: z.coerce.number().nonnegative(),
        stockActual: z.coerce.number().nonnegative().optional()
    })
});


export const updateProductoSchema = z.object({
    params: z.object({ id: z.string() }),
    body: z.object({
        codigo: z.string().min(1).optional(),
        nombre: z.string().min(1).optional(),
        descripcion: z.string().optional(),
        categoria: z.string().optional(),
        unidad: z.string().min(1).optional(),
        stockMinimo: z.coerce.number().nonnegative().optional()
    })
});