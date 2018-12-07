import validator from 'validator';
import Incident from '../models/incident';
import Config from '../utils/config';

const { error } = Config;
const incident = new Incident();

class ValidatePost {
  static createIncident(req, res, next) {
    incident.setType(req.params.type);
    incident.createdBy = req.body.userId;
    incident.comment = req.body.comment;
    incident.description = req.body.description ? req.body.description : '';
    incident.location = `${req.body.latitude},${req.body.longitude}`;
    incident.Images = req.body.images ? req.body.images.split(',') : [];
    incident.Videos = req.body.videos ? req.body.videos.split(',') : [];
    if (!incident.isIncident()) {
      error(res, Config.STATUS_BAD_REQUEST, Config.MESSAGE_INVALID_TYPE);
    } else if (validator.isEmpty(req.body.latitude) || validator.isEmpty(req.body.longitude)) {
      error(res, Config.STATUS_BAD_REQUEST, Config.MESSAGE_BAD_LOCATION);
    } else if (!validator.isLatLong(incident.location)) {
      error(res, Config.STATUS_UNPROCESSED, Config.MESSAGE_BAD_LOCATION);
    } else if (!incident.comment || validator.isEmpty(incident.comment)) {
      error(res, Config.STATUS_BAD_REQUEST, Config.MESSAGE_BAD_COMMENT);
    }
    req.body.incident = incident;
    next();
  }
}

export default ValidatePost;
