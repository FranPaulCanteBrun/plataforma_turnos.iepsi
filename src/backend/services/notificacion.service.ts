import { AppDataSource } from "../database/data-source";
import { Notificacion } from "../database/entities/Notificacion";
import { Usuario } from "../database/entities/Usuario";
import { enviarCorreo } from "../utils/mailer";

export const logNotificacion = async (
  tipo: string,
  contenido: string,
  usuario: Usuario
) => {
  const repo = AppDataSource.getRepository(Notificacion);

  const nueva = repo.create({ tipo, contenido, usuario });
  await repo.save(nueva);

  try {
    await enviarCorreo(usuario.email, "Notificación de IEPSI", contenido);
  } catch (error) {
    console.error("Error al enviar correo:", error);
  }
};
