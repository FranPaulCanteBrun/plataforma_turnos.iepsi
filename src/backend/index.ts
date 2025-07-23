import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

// Import rutas
import usuarioRoutes from "./routes/usuarios.routes";
import authRoutes from "./routes/auth.routes";

import { AppDataSource } from "./database/data-source";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Registro de rutas
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/login", authRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log("📦 Conexion a PostgreSQL exitosa!");

    app.listen(port, () => {
      console.log(`🚀 Servidor backend en http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("❌ Error al conectar a la base de datos:", error);
  });
