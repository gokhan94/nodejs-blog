const nodemailer = require('nodemailer')

var config = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
}


const sendMail = async ({ to, subject, html }) => {
    const transporter = nodemailer.createTransport(config)

    return transporter.sendMail({
        from: 'gkhnileri94@gmail.com', 
        to,
        subject,
        html,
      })
}

module.exports = sendMail
