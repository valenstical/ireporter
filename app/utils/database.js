import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import Constants from './constants';

const pool = new Pool();
const columns = 'id, "createdOn", type, location, status, "Images", "Videos", title, comment, "createdBy", risk';
const columnsUser = 'id, firstname, lastname, othernames, username, password, email, "phoneNumber", registered, "isAdmin", profile, "isVerified", "isBlocked", "allowSms", "allowEmail"';
class Database {
  /**
   * Utility function to execute all commands
   * @param {string} sql - The sql query to be executed
   * @param {array} params - An array of parameters
   * @param {function} then - Callback function to execute on success
   * @param {function} failure - Callback function to execute on failure
   */
  static execute(sql, params, then, failure) {
    (async () => {
      const connection = await pool.connect();
      try {
        const query = await connection.query(sql, params);
        then(query);
      } finally {
        connection.release();
      }
    })().catch((ex) => {
      console.log(ex);
      failure(ex);
    });
  }

  /**
   * Delete the specific incident from the database
   * @param {object} incident - An object representing the current red-flag or intervention
   * @param {function} echo - Callback function to be executed after successful query
   */
  static deleteIncident(incident, echo) {
    const sql = 'delete from incidents where type = $1 and id =$2 and status = $3';
    const params = [incident.type, incident.id, Constants.INCIDENT_STATUS_DRAFT];
    Database.execute(sql, params, (query) => {
      echo(query.rowCount > 0);
    });
  }

  /**
   * Delete all records from the incidents table
   * @param {function} echo - Callback function to be executed after successful query
   */
  static clearIncidents(echo) {
    const sql = 'delete from incidents';
    Database.execute(sql, [], (query) => {
      echo(query.rowCount > 0);
    });
  }

  /**
   * Update the comment or location of an intervention/red-flag record
   * @param {object} incident - The incident object to update
   * @param {function} echo - Callback function to be executed after successful query
   */
  static updateIncident(incident, echo) {
    let sql = ''; let params = [];
    if (incident.comment) {
      sql = 'update incidents set comment = ($1), title = ($2) where type = ($3) and status = ($4) and id = ($5) and "createdBy" = ($6)';
      params = [incident.comment, incident.title, incident.type,
        Constants.INCIDENT_STATUS_DRAFT, incident.id, incident.createdBy];
    } else if (incident.location) {
      sql = 'update incidents set location = ($1) where type = ($2) and status = ($3) and id = ($4) and "createdBy" = ($5)';
      params = [incident.location, incident.type, Constants.INCIDENT_STATUS_DRAFT,
        incident.id, incident.createdBy];
    } else if (incident.status) {
      sql = 'update incidents set status = ($1) where id = ($2)';
      params = [incident.status, incident.id];
    }

    Database.execute(sql, params, (query) => {
      echo(query.rowCount > 0);
    });
  }

  /**
   * Get the list of all incidents from the database
   * @param {string} sqlClause - The sql statement
   * @param {array} params - An array of values to replace the placeholder parameters
   * @param {function} echo - Callback function to be executed after successful query
   */
  static getIncidents(sqlClause, params, echo) {
    const selectCmd = `select incidents.${columns}, users.firstname, users.profile, "isVerified" from incidents left join users on "createdBy" = users.id`;
    const sql = `${selectCmd} where ${sqlClause}`;
    Database.execute(sql, params, (query) => {
      echo(query.rows);
    });
  }

  /**
   * Check the current status of an incident
   * @param {object} incident - The particular
   * @param {function} echo - Callback function to be executed after successful query
   */
  static getIncidentStatus(incident, echo) {
    Database.execute('select status from incidents where id = $1', [incident.id], (query) => {
      echo(query.rows[0]);
    });
  }

  /**
   * Creates a new incident and add to the database
   * @param {object} incident - The particular
   * @param {function} echo - Callback function to be executed after successful query
   */
  static createIncident(incident, echo) {
    const sql = `insert into incidents (${columns}) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`;
    const values = [incident.id, incident.createdOn, incident.type, incident.location,
      incident.status, incident.Images, incident.Videos, incident.title, incident.comment,
      incident.createdBy, incident.risk];
    Database.execute(sql, values, (result) => {
      echo(result);
    });
  }

  /**
   * Add a new user to the database
   * @param {object} user - The user object
   * @param {function} echo - Callback function on success
   * @param {function} failure - Callback function on failure
   */
  static createUser(user, echo, failure) {
    const sql = `insert into users (${columnsUser}) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`;
    const params = [user.id, user.firstname, user.lastname, user.othernames, user.username,
      user.password, user.email, user.phoneNumber, user.registered, user.isAdmin, user.profile,
      user.isVerified, user.isBlocked, user.allowSms, user.allowEmail];
    Database.execute(sql, params, () => {
      echo();
    }, (errors) => {
      failure(errors);
    });
  }

  /**
   * Authenticates and logs a user into the user dashboard
   * @param {object} user - The user object
   * @param {function} echo - Callback function on success
   */
  static login(user, echo) {
    const sql = `select ${columnsUser} from users where username = $1 or email = $2 or "phoneNumber" = $3`;
    const params = [user.username, user.username, user.username];
    Database.execute(sql, params, (result) => {
      if (result.rowCount > 0) {
        bcrypt.compare(user.password, result.rows[0].password, (errs, response) => {
          echo(response ? result.rows[0] : false);
        });
      } else {
        echo(false);
      }
    });
  }

  /**
   * Get a user by their ID
   * @param {number} id - The unique ID of the user
   * @param {function} echo - Callback function on success
   */
  static getUser(id, echo) {
    const sql = `select ${columnsUser} from users where id = $1`;
    const params = [id];
    Database.execute(sql, params, (result) => {
      echo(result.rowCount > 0 ? result.rows[0] : false);
    });
  }
}
export default Database;
