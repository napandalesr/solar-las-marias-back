require('dotenv').config();
const express = require('express');
var bodyParser = require('body-parser')
const nodemailer = require('nodemailer');
const cors = require("cors");
const axios = require('axios')

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const port = 4001;

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(express.json());

app.use(cors())

app.post('/send-email', async (req, res) => {
  const { to, subject, text, html } = req.body;

  // Configura el transportador SMTP con tus credenciales de Hostinger
  let transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465, // o 587 si no funciona con 465
    secure: true, // true para 465, false para otros puertos
    auth: {
      user: process.env.SMTP_USER, 
      pass: process.env.SMTP_PASS
    }
  });

  // Configura el correo electrónico
  let mailOptions = {
    from: process.env.SMTP_USER, // remitente
    to: process.env.SMTP_USER, // destinatario
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

app.get('/linkedin', async (req, res) => {
  res.status(200).json(await linkedingAuthorization(req.body.code, req.body.redirect_uri));
});

const linkedingAuthorization = async (code, redirect_uri) => {
  try {
    console.log("linkedingAuthorization");
    const response =  await axios.post(`https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&client_id=${process.env.client_id}&client_secret=${process.env.client_secret}&code=${code}&redirect_uri=${redirect_uri}`, {}, {
      headers: {
        "Content-Type": 'application/x-www-form-urlencoded',
        'grant_type': 'authorization_code',
        "code": code,
        'client_id': process.env.client_id,
        'client_secret': process.env.client_secret,
        'redirect_uri': redirect_uri
      }
    });

    console.log("response", response);
    return response;
    
  } catch (error) {
    console.log(error);
    return {error}
  }
  console.log("ooooooooook");
  
}

app.listen(port, () => {
  console.log(`Servidor escuchando en ${port}`);
});