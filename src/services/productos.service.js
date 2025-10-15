import { prisma } from "../prisma.js";


export async function createProducto(data) {
    const { stockActual = 0, ...rest } = data;
    return prisma.producto.create({
        data: { ...rest, stockActual }
    });
}


export function listProductos({ q, categoria, page = 1, pageSize = 20 }) {
    const where = {
        AND: [
            q
                ? {
                    OR: [
                        { codigo: { contains: q, mode: "insensitive" } },
                        { nombre: { contains: q, mode: "insensitive" } }
                    ]
                }
                : {},
            categoria ? { categoria } : {}
        ]
    };
    return prisma.producto.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { actualizadoEn: "desc" }
    });
}


export function getProducto(id) {
    return prisma.producto.findUnique({ where: { id: BigInt(id) } });
}


export function updateProducto(id, data) {
    return prisma.producto.update({ where: { id: BigInt(id) }, data });
}


export function productosConStockBajo() {
    return prisma.producto.findMany({
        where: { stockActual: { lt: prisma.producto.fields.stockMinimo } }
    });
}