import nodemailer from "nodemailer";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  
  const { to, csvBase64 } = req.body;
  if (!to || !csvBase64) return res.status(400).json({ error: "Missing fields" });

  try {
    const transporter = nodemailer.createTransport({
      host: "webzmb8.emailzimbraonline.com",
      port: 587,
      secure: false,
      auth: {
        user: "josivan.reis@gruposetup.com",
        pass: "Setup@4102",
      },
    });

    await transporter.sendMail({
      from: "josivan.reis@gruposetup.com",
      to,
      subject: "Solicitação de Reserva 221",
      text: "Segue em anexo a solicitação de reserva 221.",
      attachments: [
        {
          filename: "reserva221.csv",
          content: Buffer.from(csvBase64, "base64"),
          contentType: "text/csv",
        },
      ],
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Erro ao enviar email:", err);
    res.status(500).json({ error: "Erro ao enviar email" });
  }
}
