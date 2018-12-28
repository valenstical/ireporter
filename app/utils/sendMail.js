
import mailer from 'nodemailer';
import smptTransport from 'nodemailer-smtp-transport';
import Constants from './constants';

class Mailer {
  constructor(user, incident) {
    this.user = user;
    this.incident = incident;
    if (incident.status === Constants.INCIDENT_STATUS_REJECTED) {
      this.message = `Hello ${user.firstname}, your report #${incident.id} has been rejected because we could not verify your claim.`;
    } else if (incident.status === Constants.INCIDENT_STATUS_RESOLVED) {
      this.message = `Hello ${user.firstname}, your report #${incident.id} has been resolved. You may confirm and give us feedback.`;
    } else {
      this.message = `Hello ${user.firstname}, your report ${incident.id} is currently under investigation. You will continue to get feedback from us as we progress.`;
    }

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
      to: user.email,
      subject: `iReporter: New status report #${incident.id}`,
      text: this.message,
    };
  }

  send() {
    const transport = mailer.createTransport(smptTransport(this.smtp));
    transport.sendMail(this.content, () => {
      // TODO
    });
  }
}

export default Mailer;
