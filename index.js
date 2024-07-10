require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT;

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(express.json());

app.post('/send-email', async (req, res) => {
  const { to, subject, text, html } = req.body;

  // Configura el transportador SMTP con tus credenciales de Hostinger
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT == 465, // true para 465, false para otros puertos
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  // Configura el correo electrónico
  let mailOptions = {
    from: process.env.SMTP_HOST, // remitente
    to: to, // destinatario
    subject: subject,
    text: text,
    html: html
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    res.status(200).send({ message: 'Correo enviado', messageId: info.messageId });
  } catch (error) {
    res.status(500).send({ message: 'Error al enviar el correo', error });
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});