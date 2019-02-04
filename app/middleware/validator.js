import validator from 'validator';
import Random from 'random-int';
import Constants from '../utils/constants';
import Helper from '../utils/validatorHelper';
import User from '../models/user';
import Common from '../utils/common';
import Database from '../utils/database';
import File from '../models/file';

const { checkEmpty, checkLocation } = Helper;
const { error } = Common;

class Validator {
  /**
     * Check that the id is an integer
     * @param {object} req - The request object
     * @param {objec} res  -  The response object
     * @param {function} next -  The next function to pass control to another middleware
     */
  static valideteID(req, res, next) {
    if (!validator.isInt(req.incident.id)) {
      error(res, Constants.STATUS_UNPROCESSED, [Constants.MESSAGE_INVALID_ID]);
      return;
    }
    next();
  }

  /**
     * Check that the id is 9  digits long
     * @param {object} req - The request object
     * @param {objec} res  -  The response object
     * @param {function} next -  The next function to pass control to another middleware
     */
  static validateRange(req, res, next) {
    if (req.incident.id.toString().length !== 9) {
      error(res, Constants.STATUS_UNPROCESSED, [Constants.MESSAGE_OUT_OF_RANGE]);
      return;
    }
    next();
  }

  /**
     * Check that the comment of a red-flag or intervention record is valid
     * @param {object} req - The request object
     * @param {objec} res  -  The response object
     * @param {function} next -  The next function to pass control to another middleware
     */
  static validateComment(req, res, next) {
    const errors = [];
    checkEmpty(errors, req.body.comment, Constants.MESSAGE_BAD_COMMENT);
    checkEmpty(errors, req.body.title, Constants.MESSAGE_BAD_TITLE);
    if (req.body.comment && req.body.comment.trim().length > 1000) {
      errors.push(Constants.MESSAGE_LONG_COMMENT);
    }
    if (req.body.title && req.body.title.trim().length > 100) {
      errors.push(Constants.MESSAGE_LONG_TITLE);
    }
    if (errors.length > 0) {
      error(res, Constants.STATUS_BAD_REQUEST, errors);
      return;
    }
    req.incident.title = req.body.title.trim();
    req.incident.comment = req.body.comment.trim();
    req.incident.location = undefined;
    next();
  }

  /**
     * Check that the location of a red-flag or intervention record is valid
     * @param {object} req - The request object
     * @param {objec} res  -  The response object
     * @param {function} next -  The next function to pass control to another middleware
     */
  static validateLocation(req, res, next) {
    const errors = [];
    req.incident.location = `${req.body.latitude},${req.body.longitude}`;
    checkEmpty(errors, req.body.latitude, Constants.MESSAGE_BAD_LATITUDE);
    checkEmpty(errors, req.body.longitude, Constants.MESSAGE_BAD_LONGITUDE);
    checkLocation(errors, req.incident.location);

    if (errors.length > 0) {
      error(res, Constants.STATUS_BAD_REQUEST, errors);
      return;
    }
    req.incident.comment = undefined;
    next();
  }

  /**
     * Validate location and comment at the same time
     * @param {object} req - The request object
     * @param {objec} res  -  The response object
     * @param {function} next -  The next function to pass control to another middleware
     */
  static validatePostData(req, res, next) {
    const errors = [];
    req.incident.location = `${req.body.latitude},${req.body.longitude}`;
    checkEmpty(errors, req.body.latitude, Constants.MESSAGE_BAD_LATITUDE);
    checkEmpty(errors, req.body.longitude, Constants.MESSAGE_BAD_LONGITUDE);
    checkEmpty(errors, req.body.comment, Constants.MESSAGE_BAD_COMMENT);
    checkEmpty(errors, req.body.title, Constants.MESSAGE_BAD_TITLE);
    checkLocation(errors, req.incident.location);
    if (req.body.comment && req.body.comment.trim().length > 1000) {
      errors.push(Constants.MESSAGE_LONG_COMMENT);
    }
    if (req.body.title && req.body.title.trim().length > 100) {
      errors.push(Constants.MESSAGE_LONG_TITLE);
    }
    if (errors.length > 0) {
      error(res, Constants.STATUS_BAD_REQUEST, errors);
      return;
    }
    req.incident.createdOn = new Date();
    req.incident.location = `${req.body.latitude},${req.body.longitude}`;
    req.incident.status = Constants.INCIDENT_STATUS_DRAFT;
    req.incident.id = Random(100000000, 999999999);
    req.incident.Images = req.body.Images ? req.incident.Images.split(',') : [];
    req.incident.Videos = req.body.Videos ? req.incident.Videos.split(',') : [];
    req.incident.state = req.body.state || null;
    next();
  }

  /**
     * Check that the status of a red-flag or intervention record is valid
     * @param {object} req - The request object
     * @param {objec} res  -  The response object
     * @param {function} next -  The next function to pass control to another middleware
     */
  static validateStatus(req, res, next) {
    const { status } = req.body;
    if (!(status === Constants.INCIDENT_STATUS_DRAFT
      || status === Constants.INCIDENT_STATUS_REJECTED
      || status === Constants.INCIDENT_STATUS_RESOLVED
      || status === Constants.INCIDENT_STATUS_UNDER_INVESTIGATION)) {
      error(res, Constants.STATUS_BAD_REQUEST, [Constants.MESSAGE_BAD_DATA_STATUS]);
      return;
    }
    req.incident.location = undefined; req.incident.comment = undefined;
    req.incident.status = status;
    next();
  }

  /**
   * Check that the status is not empty or missing
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {function} next - The next function used to pass control to another middleware
   */
  static checkStatus(req, res, next) {
    const { status } = req.body;
    if (!status || validator.isEmpty(status)) {
      error(res, Constants.STATUS_BAD_REQUEST, [Constants.MESSAGE_EMPTY_STATUS]);
      return;
    }
    next();
  }

  /**
   * Check that the media path is not empty or missing
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {function} next - The next function used to pass control to another middleware
   */
  static checkMedia(req, res, next) {
    const { path } = req.body;
    let type = path ? path.split('.') : [''];
    type = type[type.length - 1];
    type = type.toLowerCase();
    if (!path || validator.isEmpty(path) || (type !== 'mp4' && ['jpg', 'jpeg', 'gif', 'png'].indexOf(type) === -1)) {
      error(res, Constants.STATUS_BAD_REQUEST, [Constants.MESSAGE_NO_FILE]);
      return;
    }
    req.body.type = type === 'mp4' ? 'Video' : 'Image';
    next();
  }

  /**
   * Validates signup fields
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {function} next - The next function used to pass control to another middleware
   */
  static validateSignup(req, res, next) {
    const errors = [];
    checkEmpty(errors, req.body.firstname, Constants.MESSAGE_NO_FIRST_NAME);
    checkEmpty(errors, req.body.lastname, Constants.MESSAGE_NO_LAST_NAME);
    checkEmpty(errors, req.body.username, Constants.MESSAGE_NO_SIGNUP_USERNAME);
    checkEmpty(errors, req.body.phoneNumber, Constants.MESSAGE_NO_PHONE_NUMBER);
    checkEmpty(errors, req.body.email, Constants.MESSAGE_NO_EMAIL_ADDRESS);
    if (req.body.email && !validator.isEmail(req.body.email)) {
      errors.push(Constants.MESSAGE_NO_EMAIL_ADDRESS);
    }
    if (req.body.phoneNumber && !validator.isMobilePhone(req.body.phoneNumber, ['en-NG'])) {
      errors.push(Constants.MESSAGE_NO_PHONE_NUMBER);
    }
    const user = new User(req.body);
    if (req.incident) {
      user.id = req.incident.id;
    } else {
      checkEmpty(errors, req.body.password, Constants.MESSAGE_NO_PASSWORD);
      user.id = Random(100000000, 999999999);
      user.allowEmail = true;
      user.allowSms = true;
      user.isAdmin = false;
      user.isBlocked = false;
      user.isVerified = false;
      user.profile = 'images/profile/default.jpg';
      user.registered = new Date();
    }
    req.user = user;
    if (errors.length !== 0) {
      error(res, Constants.STATUS_BAD_REQUEST, errors);
      return;
    }
    next();
  }

  /**
   * Validates log in parameters
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {function} next - The next function used to pass control to another middleware
   */
  static validateLogin(req, res, next) {
    const errors = [];
    const user = new User(req.body);
    checkEmpty(errors, user.password, Constants.MESSAGE_NO_PASSWORD);
    checkEmpty(errors, user.username, Constants.MESSAGE_NO_USERNAME);

    if (errors.length !== 0) {
      error(res, Constants.STATUS_BAD_REQUEST, errors);
      return;
    }
    req.user = user;
    next();
  }

  /**
   * Verifies that the password field is provided
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {function} next - The next function used to pass control to another middleware
   */
  static validatePassword(req, res, next) {
    const errors = [];
    const user = new User(req.body);
    user.id = req.incident.id;
    checkEmpty(errors, user.password, Constants.MESSAGE_NO_PASSWORD);
    if (errors.length !== 0) {
      error(res, Constants.STATUS_BAD_REQUEST, errors);
      return;
    }
    req.user = user;
    next();
  }

  /**
   * Checks that the incident exists
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {function} next - The next function used to pass control to another middleware
   */
  static validateIncident(req, res, next) {
    const suffix = req.isAdmin ? 'is not null' : ' = $3';
    const param = [req.incident.id, req.incident.type].concat(req.isAdmin ? []
      : [req.incident.createdBy]);
    Database.getIncidents(`incidents.id = $1 and incidents.type = $2 and "createdBy" ${suffix}`, param, (rows) => {
      if (rows.length === 0) {
        error(res, Constants.STATUS_NOT_FOUND, [req.isAdmin ? `There is no ${req.incident.type} record with that id`
          : `You do not have any ${req.incident.type} record with that id`]);
        return;
      }
      next();
    });
  }

  /**
   * Checks that the status of the incident is in draft mode
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {function} next - The next function used to pass control to another middleware
   */
  static verifyStatus(req, res, next) {
    Database.getIncidentStatus(req.incident, (result) => {
      if (result.status !== Constants.INCIDENT_STATUS_DRAFT) {
        error(res, Constants.STATUS_FORBIDDEN, [`You can no longer alter this ${req.incident.type} record because it is no longer in draft mode.`]);
        return;
      }
      next();
    });
  }

  /**
   * Checks that the user with the specified id exists
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {function} next - The next function used to pass control to another middleware
   */
  static verifyUser(req, res, next) {
    Database.getUser(req.user.id, (result) => {
      if (!result) {
        error(res, Constants.STATUS_UNPROCESSED, ['There is no user with the id you provided.']);
        return;
      }
      next();
    });
  }

  /**
   * Checks that a file was uploaed
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {function} next - The next function used to pass control to another middleware
   */
  static verifyFile(req, res, next) {
    if (!req.files.file) {
      error(res, Constants.STATUS_BAD_REQUEST, [Constants.MESSAGE_NO_FILE]);
      return;
    }
    const file = new File(req.files.file);
    req.file = file;
    next();
  }

  /**
   * Checks that a file is an image
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {function} next - The next function used to pass control to another middleware
   */
  static validateImage(req, res, next) {
    if (!req.file.isImage()) {
      error(res, Constants.STATUS_BAD_REQUEST, [Constants.MESSAGE_NOT_IMAGE]);
      return;
    }
    next();
  }

  /**
   * Checks that a file is a video
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {function} next - The next function used to pass control to another middleware
   */
  static validateVideo(req, res, next) {
    if (!req.file.isVideo()) {
      error(res, Constants.STATUS_BAD_REQUEST, [Constants.MESSAGE_NOT_VIDEO]);
      return;
    }
    next();
  }
}


export default Validator;
