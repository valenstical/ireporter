import Database from '../utils/connector';
import Constants from '../utils/constants';

const { success, error } = Constants;

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
    Database.createUser(this, () => {
      const authToken = Constants.createToken(this.id);
      success(res, Constants.STATUS_CREATED, [{ token: authToken, user: this }]);
    }, (ex) => {
      let message = 'Phone numbe is already registered';
      if (ex.constraint === 'users_username_key') {
        message = 'Username is already taken';
      } else if (ex.constraint === 'users_email_key') {
        message = 'Email is already registered';
      }
      error(res, Constants.STATUS_BAD_REQUEST, message);
    });
  }

  /**
   * Authenticates a and logs in user
   * @param {object} res - The response object
   */
  login(res) {
    Database.login(this, (result) => {
      if (result) {
        const authToken = Constants.createToken(result.id);
        success(res, Constants.STATUS_OK, [{ token: authToken, user: result }]);
      } else {
        error(res, Constants.STATUS_NOT_FOUND, Constants.MESSAGE_INVALID_LOGIN);
      }
    });
  }
}

export default User;
