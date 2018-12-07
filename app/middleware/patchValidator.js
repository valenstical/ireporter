import validator from 'validator';
import Incident from '../models/incident';
import Config from '../utils/config';

const { error } = Config;
const incident = new Incident();

class ValidatePatch {
  static updateIncident(req, res, next) {
    if (req.params.action === 'comment') {
      ValidatePatch.updateComment(req, res, next);
    } else if (req.params.action === 'location') {
      ValidatePatch.updateLocation(req, res, next);
    } else {
      error(res, Config.STATUS_NOT_FOUND, Config.MESSAGE_NOT_FOUND);
    }
  }


  static updateComment(req, res, next) {
    incident.setType(req.params.type);
    incident.id = req.params.id;
    incident.comment = req.body.comment;
    if (!incident.isIncident()) {
      error(res, Config.STATUS_BAD_REQUEST, Config.MESSAGE_INVALID_TYPE);
    } else if (!incident.comment || validator.isEmpty(incident.comment)) {
      error(res, Config.STATUS_BAD_REQUEST, Config.MESSAGE_BAD_COMMENT);
    } else if (!validator.isInt(incident.id)) {
      error(res, Config.STATUS_UNPROCESSED, Config.MESSAGE_INVALID_ID);
    }
    incident.id = parseInt(incident.id, 10);
    req.body.incident = incident;
    next();
  }

  static updateLocation(req, res, next) {
    incident.setType(req.params.type);
    incident.id = req.params.id;
    incident.location = `${req.body.latitude},${req.body.longitude}`;
    if (!incident.isIncident()) {
      error(res, Config.STATUS_BAD_REQUEST, Config.MESSAGE_INVALID_TYPE);
    } else if (validator.isEmpty(req.body.latitude) || validator.isEmpty(req.body.longitude)) {
      error(res, Config.STATUS_BAD_REQUEST, Config.MESSAGE_BAD_LOCATION);
    } else if (!validator.isLatLong(incident.location)) {
      error(res, Config.STATUS_UNPROCESSED, Config.MESSAGE_BAD_LOCATION);
    } else if (!validator.isInt(incident.id)) {
      error(res, Config.STATUS_UNPROCESSED, Config.MESSAGE_INVALID_ID);
    }
    incident.id = parseInt(incident.id, 10);
    req.body.incident = incident;
    next();
  }
}

export default ValidatePatch;
