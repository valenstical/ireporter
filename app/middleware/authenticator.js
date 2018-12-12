

class Authenticator {
  static authenticateUser(req, res, next) {
    req.incident.createdBy = 7; // Get from jwt
    req.incident.id = req.params.id;
    // TODO
    next();
  }

  static authenticateAdmin(req, res, next) {
    req.incident.id = req.params.id;
    // TODO confirm he is an admin
    next();
  }
}

export default Authenticator;
