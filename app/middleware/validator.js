import validator from 'validator';
import Random from 'random-int';
import bcrypt from 'bcryptjs';
import Constants from '../utils/constants';
import Helper from '../utils/validatorHelper';
import User from '../models/user';
import Common from '../utils/common';
import Database from '../utils/database';
import Incident from '../models/incident';

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
      error(res, Constants.STATUS_UNPROCESSED, Constants.MESSAGE_INVALID_ID);
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
      error(res, Constants.STATUS_UNPROCESSED, Constants.MESSAGE_OUT_OF_RANGE);
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
    checkEmpty(errors, req.body.comment, 'You must provide a comment for this incident.');
    checkEmpty(errors, req.body.title, 'You must provide a title for this incident.');
    if (errors.length > 0) {
      error(res, Constants.STATUS_BAD_REQUEST, errors.join(' ** '));
      return;
    }
    req.incident.title = req.body.title;
    req.incident.comment = req.body.comment;
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
    checkEmpty(errors, req.body.latitude, 'The latitude field can not be empty');
    checkEmpty(errors, req.body.longitude, 'The longitude field can not be empty');
    checkLocation(errors, req.incident.location);

    if (errors.length > 0) {
      error(res, Constants.STATUS_BAD_REQUEST, errors.join(' ** '));
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
    checkEmpty(errors, req.body.latitude, 'The latitude is required');
    checkEmpty(errors, req.body.longitude, 'The longitude is required');
    checkEmpty(errors, req.body.comment, 'You must provide a comment for this incident');
    checkEmpty(errors, req.body.title, 'You must provide a title for this incident');
    checkLocation(errors, req.incident.location);

    if (errors.length > 0) {
      error(res, Constants.STATUS_BAD_REQUEST, errors.join(' ** '));
      return;
    }
    req.incident.createdOn = new Date();
    req.incident.location = `${req.body.latitude},${req.body.longitude}`;
    req.incident.status = Constants.INCIDENT_STATUS_DRAFT;
    req.incident.id = Random(100000000, 999999999);
    req.incident.Images = req.incident.Images ? req.incident.Images.split(',') : [];
    req.incident.Videos = req.incident.Videos ? req.incident.Videos.split(',') : [];
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
      || status === Constants.INCIDENT_STATUS_REJECTED)) {
      error(res, Constants.STATUS_BAD_REQUEST, Constants.MESSAGE_BAD_DATA_STATUS);
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
      error(res, Constants.STATUS_BAD_REQUEST, Constants.MESSAGE_EMPTY_STATUS);
      return;
    }
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
    checkEmpty(errors, req.body.firstname, 'You need to provide your first name');
    checkEmpty(errors, req.body.lastname, 'You need to provide your last name');
    checkEmpty(errors, req.body.username, 'You need to choose a username');
    checkEmpty(errors, req.body.password, 'You need to provide a password');
    checkEmpty(errors, req.body.phoneNumber, 'You need to provide your phone number');
    checkEmpty(errors, req.body.email, 'You need to provide an email address');
    if (req.body.email && !validator.isEmail(req.body.email)) {
      errors.push('You need to provide a valid email address');
    }
    if (req.body.phoneNumber && !validator.isMobilePhone(req.body.phoneNumber, ['en-NG'])) {
      errors.push('You need provide a valid phone number');
    }
    if (errors.length !== 0) {
      error(res, Constants.STATUS_BAD_REQUEST, errors);
      return;
    }
    const user = new User(req.body);
    user.id = Random(100000000, 999999999);
    user.allowEmail = true;
    user.allowSms = true;
    user.isAdmin = false;
    user.isBlocked = false;
    user.risk = 0;
    user.isVerified = false;
    user.profile = 'profile.jpg';
    user.registered = new Date();

    bcrypt.hash(user.password, 10, (errs, hash) => {
      user.password = hash;
      req.user = user;
      next();
    });
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
    checkEmpty(errors, user.password, 'You need to provide a password');
    checkEmpty(errors, user.username, 'Your username is required. You can also provide your phone number or email address.');

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
    Database.getIncidents('incidents.id = $1 and incidents.type = $2', [req.incident.id, req.incident.type], (rows) => {
      if (rows.length === 0) {
        error(res, Constants.STATUS_NOT_FOUND, `There is no ${req.incident.type} record with that id`);
        return;
      }
      const { createdBy } = rows[0];
      req.incident.createdBy = createdBy;
      next();
    });
  }
}


export default Validator;
