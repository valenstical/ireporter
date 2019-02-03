import Constants from '../utils/constants';
import Database from '../utils/database';
import Mailer from '../utils/sendMail';
import SMS from '../utils/sendSms';
import Common from '../utils/common';

const { success } = Common;

class Incident {
  /**
   * Initializes an Incident which can be red-flag or intervention
   * @constructor
   * @param {object} data - An object containing all incident information.
   */
  constructor(data) {
    this.id = data.id;
    this.createdOn = data.createdOn;
    this.createdBy = data.createdBy;
    this.type = data.type;
    this.location = data.location;
    this.status = data.status;
    this.Images = data.Images;
    this.Videos = data.Videos;
    this.comment = data.comment;
    this.title = data.title;
    this.risk = data.risk;
    this.state = data.state;
  }


  /**
 * Delete an incident from the database
 * @param {object} res - the response object.
 */
  deleteIncident(res) {
    Database.deleteIncident(this, () => {
      success(res, Constants.STATUS_OK, [{ id: this.id, message: `${this.type} record has been deleted` }]);
    });
  }

  /**
 * This is an helper function to get all incidents or a specific incident
 * @param {string} type - The type of incident (red-flag or intervention)
 * @param {object} req - The request object
 * @param {object} res - The repsonse object
 * @param {integer} id - The id of the selected incident
 */
  getAllIncidents(req, res) {
    let qry = !this.id ? '' : ' and incidents.id=$3';
    qry = !req.isAdmin ? qry : ' or "createdBy" is not null';
    const extra = this.type === Constants.INCIDENT_TYPE_ALL ? ' or type is not null' : '';
    const params = !this.id ? [this.type, this.createdBy] : [this.type, this.createdBy, this.id];
    Database.getIncidents(`type = $1${extra} and ("createdBy" = $2${qry})`, params, (result) => {
      success(res, Constants.STATUS_OK, result);
    });
  }

  /**
   * Add a new intervention or red-flag record to the database
   * @param {object} res - The resource object
   */
  createIncident(res) {
    Database.createIncident(this, () => {
      success(res, Constants.STATUS_CREATED, [{ id: this.id, message: `Created ${this.type} record` }]);
    });
  }

  /**
   * Update the comment of an intervention of red-flag record
   * @param {object} res - The response object
   */
  updateIncident(res) {
    const action = this.location ? 'location' : 'comment';
    Database.updateIncident(this, () => {
      success(res, Constants.STATUS_OK, [{ id: this.id, message: `Updated ${this.type}'s ${action}` }]);
    });
  }

  /**
   * Update the status of an intervention of red-flag record
   * @param {object} res - The response object
   */
  updateStatus(res) {
    Database.updateIncident(this, () => {
      success(res, Constants.STATUS_OK, [{ id: this.id, message: `Updated ${this.type}'s record status` }]);
      Database.getUser(this.createdBy, (user) => {
        const mail = new Mailer(user, this);
        mail.send();
        const sms = new SMS(user, this);
        sms.send();
      });
    });
  }
}


export default Incident;
