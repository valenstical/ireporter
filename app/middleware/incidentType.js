import Constants from '../utils/constants';
import Incident from '../models/incident';

class IncidentType {
  /**
   * Sets the current incident type to intervention
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {function} next - The next() function for routing requests to the next middleware
   */
  static setIntervention(req, res, next) {
    const incident = new Incident(req.body);
    incident.type = Constants.INCIDENT_TYPE_INTERVENTION;
    req.incident = incident;
    next();
  }

  /**
   * Sets the current incident type to red-flag
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {function} next - The next() function for routing requests to the next middleware
   */
  static setRedFlag(req, res, next) {
    const incident = new Incident(req.body);
    incident.type = Constants.INCIDENT_TYPE_RED_FLAG;
    req.incident = incident;
    next();
  }

  /**
   * Sets the current incident type to all types
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {function} next - The next() function for routing requests to the next middleware
   */
  static setAll(req, res, next) {
    const incident = new Incident(req.body);
    incident.type = Constants.INCIDENT_TYPE_ALL;
    req.incident = incident;
    next();
  }
}

export default IncidentType;
