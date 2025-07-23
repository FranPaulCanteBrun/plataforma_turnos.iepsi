import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: process.env.DB_USER!,
  password: String(process.env.DB_PASS!),
  database: process.env.DB_NAME!,
  synchronize: true, // No olvidar desactivar en Produccion
  logging: false,
  entities: [__dirname + "/entities/*.ts"],
  migrations: [__dirname + "/migrations/*.ts"],
  subscribers: [],
});
