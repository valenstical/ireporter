import Constants from '../utils/constants';
import Incident from '../models/incident';

class IncidentType {
  static setIntervention(req, res, next) {
    const incident = new Incident(req.body);
    incident.type = Constants.INCIDENT_TYPE_INTERVENTION;
    req.incident = incident;
    next();
  }

  static setRedFlag(req, res, next) {
    const incident = new Incident(req.body);
    incident.type = Constants.INCIDENT_TYPE_RED_FLAG;
    req.incident = incident;
    next();
  }
}

export default IncidentType;
