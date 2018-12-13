import Constants from '../utils/constants';
import Database from '../utils/connector';

const { success, error } = Constants;

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
    this.Images = data.Images ? data.Images.split(',') : [];
    this.Videos = data.Videos ? data.Videos.split(',') : [];
    this.comment = data.comment;
    this.title = data.title;
    this.risk = data.risk;
  }


  /**
 * Delete an incident from the database
 * @param {object} res - the response object.
 */
  deleteIncident(res) {
    Database.deleteIncident(this, (deleted) => {
      if (deleted) {
        success(res, Constants.STATUS_OK, [{ id: this.id, message: `${this.type} record has been deleted` }]);
      } else {
        error(res, Constants.STATUS_NOT_FOUND, `The ${this.type} record could not be deleted. The status may have changed or the record no longer exists.`);
      }
    });
  }

  /**
 * This is an helper function to get all incidents
 * @param {string} type - The type of incident (red-flag or intervention)
 * @param {object} req - The request object
 * @param {object} res - The repsonse object
 * @param {integer} id - The id of the selected incident
 */
  getAllIncidents(res) {
    const qry = !this.id ? '' : ' and incidents.id=$3';
    const params = !this.id ? [this.type, this.createdBy] : [this.type, this.createdBy, this.id];
    Database.getIncidents(`type = $1 and "createdBy" = $2${qry}`, params, (result) => {
      if (result.length === 0 && this.id) {
        error(res, Constants.STATUS_NOT_FOUND, `There is no ${this.type} record with that id`);
      } else {
        success(res, Constants.STATUS_OK, result);
      }
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
    Database.updateIncident(this, (updated) => {
      if (updated) {
        success(res, Constants.STATUS_OK, [{ id: this.id, message: `Updated ${this.type}'s ${action}` }]);
      } else {
        error(res, Constants.STATUS_NOT_FOUND, `The ${this.type} record could not be updated. The status may have changed or the record no longer exists.`);
      }
    });
  }

  /**
   * Update the status of an intervention of red-flag record
   * @param {object} res - The response object
   */
  updateStatus(res) {
    Database.updateIncident(this, (updated) => {
      if (updated) {
        success(res, Constants.STATUS_OK, [{ id: this.id, message: `Updated ${this.type}'s record status` }]);
      } else {
        error(res, Constants.STATUS_NOT_FOUND, `The ${this.type} record could not be updated. The record may no longer exists.`);
      }
    });
  }
}


export default Incident;
