import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASS,
  },
});

export const enviarCorreo = async (
  destinatario: string,
  asunto: string,
  texto: string
) => {
  await transporter.sendMail({
    from: `"IEPSI S.A" <${process.env.EMAIL_FROM}>`,
    to: destinatario,
    subject: asunto,
    text: texto,
  });
};
