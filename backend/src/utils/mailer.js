import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const enviarCorreoVerificacion = async (email, codigo) => {
  console.log(`\n🔔 [HACKATHON TIP] Código para ${email}: ${codigo}\n`);

  try {
    await transporter.sendMail({
      from: '"Hackathon" <no-reply@mihackathon.com>',
      to: email,
      subject: 'Verifica tu cuenta',
      html: `<h2>¡Bienvenido!</h2><p>Tu código de verificación es: <b style="font-size: 24px;">${codigo}</b></p>`
    });
  } catch (error) {
    console.error('Error enviando correo:', error);
  }
};