import express from "express";
import dotenv from "dotenv";
import productosRouter from "./routes/productos.routes.js";
import movimientosRouter from "./routes/movimientos.routes.js";
import proveedoresRouter from "./routes/proveedores.routes.js";
import clientesRouter from "./routes/clientes.routes.js";
import errorHandler from "./middlewares/errorHandler.js";


dotenv.config();


const app = express();
app.use(express.json());


app.get("/health", (_req, res) => res.json({ ok: true }));


app.use("/productos", productosRouter);
app.use("/movimientos", movimientosRouter);
app.use("/proveedores", proveedoresRouter);
app.use("/clientes", clientesRouter);


app.use(errorHandler);


export default app;