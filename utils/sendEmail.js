const nodemailer = require('nodemailer');

function sendEmail(email, appPassword, recipient, subject, htmlContent) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: email,
      pass: appPassword, // Utilisez le mot de passe d'application spécifique ici
    },
  });

  const mailOptions = {
    from: email,
    to: recipient,
    subject: subject,
    html: htmlContent,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('Erreur lors de l\'envoi de l\'e-mail :', error);
      console.log({"Email":recipient})
    } else {
      console.log('E-mail envoyé :', info.response);
    }
  });
}

module.exports = sendEmail;