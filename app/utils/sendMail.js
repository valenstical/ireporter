
import mailer from 'nodemailer';
import smptTransport from 'nodemailer-smtp-transport';

class Mailer {
  constructor(to, subject, text, html) {
    this.to = to;
    this.subject = subject;
    this.text = text;
    this.html = html;

    this.smtp = {
      host: process.env.EMAILHOST,
      port: process.env.EMAILPORT,
      secure: process.env.EMAILSECURE,
      auth: {
        user: process.env.EMAILUSERNAME,
        pass: process.env.EMAILPASSWORD,
      },
    };
    this.content = {
      from: process.env.EMAILFROM,
      replyTo: process.env.EMAILREPLYTO,
      to: this.to,
      subject: this.subject,
      text: this.text,
      html: this.html,
    };
  }

  send() {
    const transport = mailer.createTransport(smptTransport(this.smtp));
    transport.sendMail(this.content);
  }
}

export default Mailer;
