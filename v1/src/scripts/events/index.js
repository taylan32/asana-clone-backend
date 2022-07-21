const eventEmitter = require("./eventEmitter");
const nodeMailer = require("nodemailer");
module.exports = () => {
  eventEmitter.on("send_mail", (emailData) => {
    let transporter = nodeMailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    let info = transporter.sendMail({
        from : process.env.EMAIL_FROM,
        ...emailData
    })
  });
};
