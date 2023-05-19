import nodemailer from "nodemailer"

export const emailRegistro = async (datos) => {

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  const { nombre, email, token } = datos

  // enviar email
  const info = await transporter.sendMail({
    from: "APV - Administrador de pacientes de veterinaria",
    to: email,
    subject: "Comprueba tu cuenta en APV",
    text:  "Comprueba tu cuenta en APV",
    html: `
    <p>Hola, ${nombre}. Comprueba tu cuenta en APV</p>
    <p>Para hacerlo haz click en el siguiente enlace <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar cuenta</a></p>
    <p>Si no creaste esta cuenta, ignora este mensaje</p>
    `
  })

}
