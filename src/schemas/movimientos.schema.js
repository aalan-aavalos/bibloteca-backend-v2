import { z } from "zod";


export const createMovimientoSchema = z.object({
    body: z.object({
        fecha: z.string().datetime().optional(),
        tipo: z.enum(["ENTRADA", "SALIDA"]),
        productoId: z.coerce.bigint(),
        cantidad: z.coerce.number().positive(),
        referencia: z.string().optional(),
        responsable: z.string().optional(),
        proveedorId: z.coerce.bigint().optional(),
        clienteId: z.coerce.bigint().optional()
    })
});