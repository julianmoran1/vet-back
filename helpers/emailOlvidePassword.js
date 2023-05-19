import nodemailer from "nodemailer"

export const emailOlvidePassword = async (datos) => {

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
    subject: "Reestablece tu password",
    text:  "Reestablece tu password",
    html: `
    <p>Hola, ${nombre}. Has solicitado reestablecer tu password</p>
    <p>Para hacerlo haz click en el siguiente enlace <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Cambiar password</a></p>
    <p>Si no creaste esta cuenta, ignora este mensaje</p>
    `
  })

}
