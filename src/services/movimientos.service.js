import { prisma } from "../prisma.js";

export async function crearMovimiento(payload) {
    const {
        fecha,
        tipo,
        productoId,
        cantidad,
        referencia,
        responsable,
        proveedorId,
        clienteId
    } = payload;

    return prisma.$transaction(async (tx) => {
        const prod = await tx.producto.findUnique({ where: { id: BigInt(productoId) } });
        if (!prod) {
            const e = new Error("Producto no existe");
            e.status = 404; throw e;
        }

        if (tipo === "ENTRADA" && !proveedorId) {
            const e = new Error("proveedorId requerido para ENTRADA");
            e.status = 400; throw e;
        }
        if (tipo === "SALIDA" && !clienteId) {
            const e = new Error("clienteId requerido para SALIDA");
            e.status = 400; throw e;
        }

        if (tipo === "SALIDA" && Number(prod.stockActual) < cantidad) {
            const e = new Error("Stock insuficiente");
            e.status = 422; throw e;
        }

        const movimiento = await tx.movimiento.create({
            data: {
                fecha: fecha ? new Date(fecha) : undefined,
                tipo,
                cantidad,
                referencia,
                responsable,
                productoId: BigInt(productoId),
                proveedorId: proveedorId ? BigInt(proveedorId) : null,
                clienteId: clienteId ? BigInt(clienteId) : null
            }
        });

        const delta = tipo === "ENTRADA" ? cantidad : -cantidad;

        await tx.producto.update({
            where: { id: BigInt(productoId) },
            data: { stockActual: (Number(prod.stockActual) + delta).toString() }
        });

        return movimiento;
    });
}

export function listMovimientos({ productoId, tipo, desde, hasta, page = 1, pageSize = 20 }) {
    const where = {
        AND: [
            productoId ? { productoId: BigInt(productoId) } : {},
            tipo ? { tipo } : {},
            (desde || hasta) ? {
                fecha: {
                    gte: desde ? new Date(desde) : undefined,
                    lte: hasta ? new Date(hasta) : undefined
                }
            } : {}
        ]
    };
    return prisma.movimiento.findMany({
        where,
        include: { producto: true, proveedor: true, cliente: true },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { fecha: "desc" }
    });
}

export function kardex(productoId, desde, hasta) {
    return prisma.movimiento.findMany({
        where: {
            productoId: BigInt(productoId),
            fecha: {
                gte: desde ? new Date(desde) : undefined,
                lte: hasta ? new Date(hasta) : undefined
            }
        },
        orderBy: { fecha: "asc" }
    });
}