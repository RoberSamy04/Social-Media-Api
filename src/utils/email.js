const nodeMailer = require("nodemailer");
const emailTemplate = require("../templates/emailVerication");
const passwordTemplate = require("../templates/passwordReset");

module.exports = class Email {
  constructor(user) {
    this.to = user.email;
    this.name = user.name;
    this.from = "robersamy <robersamy361@gmail.com>";
  }

  transport() {
    return nodeMailer.createTransport({
      host: process.env.MAIL_TRAP_HOST,
      port: process.env.MAIL_TRAP_PORT,
      auth: {
        user: process.env.MAIL_TRAP_USER,
        pass: process.env.MAIL_TRAP_PASS,
      },
    });
  }

  async send(template, subject) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html: template,
    };
    await this.transport().sendMail(mailOptions);
  }

  async sendOtp(otp, type) {
    if (type === "email") {
      const emailHtml = emailTemplate.html(otp, this.name);
      await this.send(emailHtml, "Verify Your Email");
    }
    if (type === "password") {
      const passwordHtml = passwordTemplate.html(otp, this.name);
      await this.send(passwordHtml, "Reset Your Password");
    }
  }
};
