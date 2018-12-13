import jwt from 'jwt-simple';
import Database from '../utils/connector';
import Constants from '../utils/constants';

const { error } = Constants;

class Authenticator {
  static authenticateUser(req, res, next) {

    if (req.headers.authorization) {
      const userId = jwt.decode(req.headers.authorization, process.env.SECRET);
      Database.getUser(userId, (user) => {
        if (user) {
          req.incident.createdBy = user.id;
          req.incident.id = req.params.id;
          next();
        } else {
          error(res, Constants.STATUS_UNATHORIZED, Constants.MESSAGE_UNATHORIZED);
        }
      });
    } else {
      error(res, Constants.STATUS_UNATHORIZED, Constants.MESSAGE_UNATHORIZED);
    }
  }

  static authenticateAdmin(req, res, next) {
    if (req.headers.authorization) {
      const userId = jwt.decode(req.headers.authorization, process.env.SECRET);
      
      Database.getUser(userId, (user) => {
        console.log(user);
        if (user && user.isAdmin) {
          req.incident.id = req.params.id;
          next();
        } else {
          error(res, Constants.STATUS_UNATHORIZED, Constants.MESSAGE_UNATHORIZED);
        }
      });
    } else {
      error(res, Constants.STATUS_UNATHORIZED, Constants.MESSAGE_UNATHORIZED);
    }
  }
}

export default Authenticator;
