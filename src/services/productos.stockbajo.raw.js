// src/services/productos.stockbajo.raw.js
import { prisma } from "../prisma.js";

/**
 * Devuelve productos con stockActual < stockMinimo,
 * ordenados por cuánto falta para llegar al mínimo.
 * PostgreSQL
 */
export async function productosStockBajoRaw() {
    return prisma.$queryRaw`
    SELECT id, codigo, nombre, "stockActual", "stockMinimo"
    FROM "Producto"
    WHERE "stockActual" < "stockMinimo"
    ORDER BY ("stockMinimo" - "stockActual") DESC
  `;
}
