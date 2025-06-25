import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import { AppDataSource } from "./database/data-source";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log("📦 Conexión a PostgreSQL exitosa!");

    app.listen(port, () => {
      console.log(`🚀 Servidor backend en http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("❌ Error al conectar a la base de datos:", error);
  });
