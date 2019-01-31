import fs from 'fs';
import Constants from '../utils/constants';
import Common from '../utils/common';
import Database from '../utils/database';

const { error, success } = Common;

class Controller {
  /**
   * This returns all the intervention or red-flag records
   * @param {object} req - The request object
   * @param {object} res - The response object
   */
  static getAllIncidents(req, res) {
    const { incident } = req;
    incident.getAllIncidents(req, res);
  }

  /**
   * This deletes the specified intervention or red-flag record
   * @param {object} req - The request object
   * @param {object} res - The response object
   */
  static deleteIncident(req, res) {
    const { incident } = req;
    incident.deleteIncident(res);
  }

  /**
   * This creates a new intervention or red-flag record
   * @param {object} req - The request object
   * @param {object} res - The response object
   */
  static createIncident(req, res) {
    const { incident } = req;
    incident.createIncident(res);
  }

  /**
   * This updates an intervention or red-flag record
   * @param {object} req - The request object
   * @param {object} res - The response object
   */
  static updateIncident(req, res) {
    const { incident } = req;
    incident.updateIncident(res);
  }

  /**
   * This updates the status of an intervention or red-flag record. Available to only the admin
   * @param {object} req - The request object
   * @param {object} res - The response object
   */
  static updateIncidentStatus(req, res) {
    const { incident } = req;
    incident.updateStatus(res);
  }

  /**
   * Logs in a user to the system and create an authentication token
   * @param {object} req - The request object
   * @param {object} res - The response object
   */
  static login(req, res) {
    const { user } = req;
    user.login(res);
  }

  /**
   * Creates an account, logs the user in and create an authentication token
   * @param {object} req - The request object
   * @param {object} res - The response object
   */
  static signup(req, res) {
    const { user } = req;
    user.createUser(res, req);
  }

  /**
   * Changes the user password
   * @param {object} req - The request object
   * @param {object} res - The response object
   */
  static updatePassword(req, res) {
    const { user } = req;
    user.changePassword(res, req);
  }

  /**
   * Upload the profile image of a user
   * @param {object} req - The request object
   * @param {object} res - The response object
   */
  static uploadProfileImage(req, res) {
    req.file.moveUploadedFile('profiles', () => {
      error(res, Constants.STATUS_SERVER_ERROR, [Constants.MESSAGE_SERVER_ERROR]);
    }, (profile) => {
      Database.updateProfileImage({ profile, id: req.incident.id }, (updated, result) => {
        if (updated) {
          const user = result;
          delete user.password;
          success(res, Constants.STATUS_OK, [user]);
        } else {
          fs.unlink(`./app/uploads/${profile}`, () => {
            error(res, Constants.STATUS_SERVER_ERROR, [Constants.MESSAGE_SERVER_ERROR]);
          });
        }
      });
    });
  }

  /**
   * Upload images and videos to a red-flag or intervention report
   * @param {object} req - The request object
   * @param {object} res - The response object
   */
  static uploadIncidentFile(req, res) {
    const fileType = req.file.isVideo() ? 'Video' : 'Image';
    req.file.moveUploadedFile('incidents', () => {
      error(res, Constants.STATUS_SERVER_ERROR, [Constants.MESSAGE_SERVER_ERROR]);
    }, (filePath) => {
      Database.addIncidentFile(filePath, req.incident.id, fileType, (updated) => {
        if (updated) {
          success(res, Constants.STATUS_OK, [{ id: req.incident.id, message: `${fileType} added to ${req.incident.type} record`, path: filePath }]);
        } else {
          fs.unlink(`./app/uploads/${filePath}`, () => {
            error(res, Constants.STATUS_SERVER_ERROR, [Constants.MESSAGE_SERVER_ERROR]);
          });
        }
      });
    });
  }

  /**
   * Deletes images and videos from a red-flag or intervention report
   * @param {object} req - The request object
   * @param {object} res - The response object
   */
  static deleteMedia(req, res) {
    const { path, type } = req.body;
    Database.deleteMedia(path, req.incident.id, () => {
      fs.unlink(`./app/uploads/${path}`, () => {
        success(res, Constants.STATUS_OK, [{ message: `Removed ${req.incident.type} ${type}` }]);
      });
    });
  }
}

export default Controller;
