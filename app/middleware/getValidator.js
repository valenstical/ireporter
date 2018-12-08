import validator from 'validator';
import Incident from '../models/incident';
import Config from '../utils/config';

const { error } = Config;
const incident = new Incident();
class ValidateGet {
  static getIncidents(req, res, next) {
    incident.setType(req.params.type);
    if (!incident.isIncident()) {
      error(res, Config.STATUS_NOT_FOUND, Config.MESSAGE_NOT_FOUND);
    }
    req.params.type = incident.type;
    next();
  }

  static getIncident(req, res, next) {
    incident.setType(req.params.type);
    incident.id = req.params.id;
    if (!validator.isInt(incident.id)) {
      error(res, Config.STATUS_UNPROCESSED, Config.MESSAGE_INVALID_ID);
    } else if (!incident.isIncident()) {
      error(res, Config.STATUS_NOT_FOUND, Config.MESSAGE_NOT_FOUND);
    }
    req.params.id = parseInt(req.params.id, 10);
    req.params.type = incident.type;
    next();
  }
}

export default ValidateGet;
