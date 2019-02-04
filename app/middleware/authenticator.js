
import Database from '../utils/database';
import Constants from '../utils/constants';
import Common from '../utils/common';

const { error } = Common;

class Authenticator {
  /**
   * This function verifies the jwt authorization token, get the user details and
     passes control to the next middleware
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {function} next - The next() function for routing requests to the next middleware
   */
  static authenticateUser(req, res, next) {
    if (req.headers.authorization) {
      const authToken = req.headers.authorization.split(' ')[1];
      Common.verifyToken(authToken, (err, data) => {
        if (err) {
          error(res, Constants.STATUS_UNATHORIZED, [Constants.MESSAGE_UNATHORIZED]);
        } else {
          Database.getUser(data.userId, (user) => {
            if (user) {
              req.incident.createdBy = user.id;
              req.incident.id = req.params.id;
              req.isAdmin = false;
              next();
            } else {
              error(res, Constants.STATUS_UNATHORIZED, [Constants.MESSAGE_UNATHORIZED]);
            }
          });
        }
      });
    } else {
      error(res, Constants.STATUS_UNATHORIZED, [Constants.MESSAGE_UNATHORIZED]);
    }
  }

  /**
   * This function verifies the jwt authorization token, and checks that the user is an admin
     then passes control to the next middleware
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {function} next - The next() function for routing requests to the next middleware
   */
  static authenticateAdmin(req, res, next) {
    if (req.headers.authorization) {
      const authToken = req.headers.authorization.split(' ')[1];
      Common.verifyToken(authToken, (err, data) => {
        if (err) {
          error(res, Constants.STATUS_UNATHORIZED, [Constants.MESSAGE_UNATHORIZED]);
        } else {
          Database.getUser(data.userId, (user) => {
            if (user && user.isAdmin) {
              req.incident.id = req.params.id;
              req.isAdmin = true;
              next();
            } else {
              error(res, Constants.STATUS_UNATHORIZED, [Constants.MESSAGE_FORBIDDEN]);
            }
          });
        }
      });
    } else {
      error(res, Constants.STATUS_UNATHORIZED, [Constants.MESSAGE_UNATHORIZED]);
    }
  }
}

export default Authenticator;
