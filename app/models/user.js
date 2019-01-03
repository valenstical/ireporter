import Database from '../utils/database';
import Constants from '../utils/constants';
import Common from '../utils/common';

const { success, error } = Common;

class User {
  /**
   * Populates the user with values from another object
   * @constructor
   * @param {object} data - The object data for initialization
   */
  constructor(data) {
    this.id = data.id;
    this.firstname = data.firstname;
    this.lastname = data.lastname;
    this.othernames = data.othernames;
    this.email = data.email;
    this.phoneNumber = data.phoneNumber;
    this.username = data.username;
    this.password = data.password;
    this.registered = data.registered;
    this.isAdmin = data.isAdmin;
    this.profile = data.profile;
    this.isBlocked = data.isBlocked;
    this.allowSms = data.allowSms;
    this.allowEmail = data.allowEmail;
  }

  /**
   * Creates a new user
   * @param {object} res - The resource object
   */
  createUser(res) {
    Database.createUser(this, (authToken) => {
      success(res, Constants.STATUS_CREATED, [{ token: authToken, user: this }]);
    }, (ex) => {
      let message = Constants.MESSAGE_DUPLICATE_PHONE_NUMBER;
      if (ex.constraint === 'users_username_key') {
        message = Constants.MESSAGE_DUPLICATE_USERNAME;
      } else if (ex.constraint === 'users_email_key') {
        message = Constants.MESSAGE_DUPLICATE_EMAIL;
      }
      error(res, Constants.STATUS_BAD_REQUEST, [message]);
    });
  }

  /**
   * Authenticates and logs in user
   * @param {object} res - The response object
   */
  login(res) {
    Database.login(this, (result, authToken) => {
      if (result) {
        success(res, Constants.STATUS_OK, [{ token: authToken, user: result }]);
      } else {
        error(res, Constants.STATUS_FORBIDDEN, [Constants.MESSAGE_INVALID_LOGIN]);
      }
    }, () => {
      error(res, Constants.STATUS_SERVER_ERROR, [Constants.MESSAGE_SERVER_ERROR]);
    });
  }
}

export default User;
