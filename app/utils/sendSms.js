import request from 'request';
import urlencode from 'urlencode';
import Constants from './constants';

class SMS {
  /**
   * @constructor Initializes the phone number and message
   * @param {string} phone - The phone number to send sms to.
     Can be in international or local format
   * @param {string} message - The message to send
   */
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
  }

  /**
   * Sends the message using beta sms api endpoint
   */
  send() {
    const url = `http://login.betasms.com/api/?sender=${process.env.BETAID}&username=${process.env.BETAUSERNAME}&password=${process.env.BETAPASSWORD}&message=${urlencode(this.message)}&mobiles=${this.user.phoneNumber}`;
    request.get(url);
  }
}

export default SMS;
