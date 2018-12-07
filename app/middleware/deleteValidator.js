import validator from 'validator';
import Incident from '../models/incident';
import Config from '../utils/config';

const { error } = Config;
const incident = new Incident();

class ValidatePost {
  static deleteIncident(req, res, next) {
    incident.setType(req.params.type);
    incident.id = req.params.id;
    if (!incident.isIncident()) {
      error(res, Config.STATUS_BAD_REQUEST, Config.MESSAGE_INVALID_TYPE);
    } else if (!validator.isInt(incident.id)) {
      error(res, Config.STATUS_UNPROCESSED, Config.MESSAGE_NOT_FOUND);
    }
    incident.id = parseInt(incident.id, 10);
    req.body.incident = incident;
    next();
  }
}

export default ValidatePost;
