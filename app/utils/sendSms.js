import request from 'request';
import urlencode from 'urlencode';

class SMS {
  /**
   * @constructor Initializes the phone number and message
   * @param {string} phone - The phone number to send sms to. 
     Can be in international or local format
   * @param {string} message - The message to send
   */
  constructor(phone, message) {
    this.phone = phone;
    this.message = urlencode(message);
  }

  /**
   * Sends the message using beta sms api endpoint
   */
  send() {
    const url = `http://login.betasms.com/api/?sender=${urlencode(process.env.BETAID)}&username=${process.env.BETAUSERNAME}&password=${process.env.BETAPASSWORD}&message=${this.message}&mobiles=${this.phone}`;
    request.get(url);
  }
}

export default SMS;
