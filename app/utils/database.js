import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import Common from './common';
import Constants from './constants';

const pool = new Pool();
const columns = 'id, "createdOn", type, location, status, "Images", "Videos", title, comment, "createdBy", risk, state';
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
      // console.log(ex);
      if (typeof failure === 'function') {
        failure(ex);
      }
    });
  }

  /**
   * Delete the specific incident from the database
   * @param {object} incident - An object representing the current red-flag or intervention
   * @param {function} echo - Callback function to be executed after successful query
   */
  static deleteIncident(incident, echo) {
    const sql = 'delete from incidents where type = $1 and id =$2 and "createdBy" = $3';
    const params = [incident.type, incident.id, incident.createdBy];
    Database.execute(sql, params, (query) => {
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
      sql = 'update incidents set comment = ($1), title = ($2) where type = ($3) and id = ($4) and "createdBy" = ($5)';
      params = [incident.comment, incident.title, incident.type, incident.id, incident.createdBy];
    } else if (incident.location) {
      sql = 'update incidents set location = ($1) where type = ($2) and id = ($3) and "createdBy" = ($4)';
      params = [incident.location, incident.type, incident.id, incident.createdBy];
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
    const sql = `${selectCmd} where ${sqlClause} order by "createdOn" desc`;
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
    const sql = `insert into incidents (${columns}) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`;
    const values = [incident.id, incident.createdOn, incident.type, incident.location,
      incident.status, incident.Images, incident.Videos, incident.title, incident.comment,
      incident.createdBy, incident.risk, incident.state];
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
    let password;
    bcrypt.hash(user.password, 10, (errs, hash) => {
      password = hash;
      const sql = `insert into users (${columnsUser}) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) 
      on conflict (id) do update set firstname = EXCLUDED.firstname, lastname=EXCLUDED.lastname, othernames=EXCLUDED.othernames, username=EXCLUDED.username,
      "phoneNumber"=EXCLUDED."phoneNumber", email=EXCLUDED.email RETURNING *`;
      const params = [user.id, user.firstname, user.lastname, user.othernames, user.username,
        password, user.email, user.phoneNumber, user.registered, user.isAdmin, user.profile,
        user.isVerified, user.isBlocked, user.allowSms, user.allowEmail];
      Database.execute(sql, params, (result) => {
        Common.createToken(user.id, (authToken) => {
          echo(authToken, result);
        });
      }, (errors) => {
        failure(errors);
      });
    });
  }

  /**
   * Authenticates and logs a user into the user dashboard
   * @param {object} user - The user object
   * @param {function} echo - Callback function on success
   * @param {funcion} error - Callback function on database error
   */
  static login(user, echo, error) {
    const sql = `select ${columnsUser} from users where username = $1 or email = $2 or "phoneNumber" = $3`;
    const params = [user.username, user.username, user.username];
    Database.execute(sql, params, (result) => {
      if (result.rowCount > 0) {
        bcrypt.compare(user.password, result.rows[0].password, (errs, response) => {
          Common.createToken(result.rows[0].id, (authToken) => {
            echo(response ? result.rows[0] : false, authToken);
          });
        });
      } else {
        echo(false);
      }
    }, error);
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

  /**
   * Change a user password
   * @param {object} user - The user object
   * @param {function} echo - Callback function on success
   */
  static changePassword(user, echo) {
    const sql = 'update users set password = $1 where id = $2';
    bcrypt.hash(user.password, 10, (err, hash) => {
      const params = [hash, user.id];
      Database.execute(sql, params, (result) => {
        echo(result.rowCount > 0);
      });
    });
  }

  /**
   * Change user profile image
   * @param {object} user - The user object
   * @param {function} echo - Callback function on success
   */
  static updateProfileImage(user, echo) {
    const sql = 'update users set profile = $1 where id = $2 RETURNING *';
    Database.execute(sql, [user.profile, user.id], (result) => {
      echo(result.rowCount > 0, result.rows[0]);
    });
  }

  /**
   * Adds a new image to the selected red-flag or intervention record
   * @param {string} path - The relative file path generated
   * @param {number} id - The red-flag or intervention unique ID
   * @param {type}  type - The type of file (Image or Video)
   * @param {function} echo - Callback function on success
   */
  static addIncidentFile(path, id, type, echo) {
    const sql = `update incidents set "${type}s" = array_cat("${type}s", $1) where id = $2`;
    Database.execute(sql, [`{${path}}`, id], (result) => {
      echo(result.rowCount > 0, result.rows[0]);
    });
  }

  /**
   * Deletes the media of the selected red-flag or intervention record
   * @param {string} path - The relative path of the image of video
   * @param {number} id - The red-flag or intervention unique ID
   * @param {function} echo - Callback function on success
   */
  static deleteMedia(path, id, echo) {
    const sql = 'update incidents set "Images" = array_remove("Images", $1), "Videos" = array_remove("Videos", $2) where id = $3';
    Database.execute(sql, [`${path}`, `${path}`, id], (result) => {
      echo(result.rowCount > 0, result.rows[0]);
    });
  }

  /**
   * Deletes a user from the database
   * @param {string} identifier - The user unique id or email address
   * @param {function} echo - callback function to execute
   */
  /*
  static deleteUser(identifier, echo) {
    const column = validator.isInt(identifier) ? 'id' : 'email';
    Database.execute(`delete from users where ${column} = $1`, [identifier], (result) => {
      echo(result.rowCount > 0);
    });
  }
*/
  /**
   * Clears the database. Used for testing only
   * @param {function} echo - callback function to execute
   */
  static refreshDatabase(echo) {
    Database.execute(`${Constants.SQL_CREATE_TABLES}delete from incidents;delete from users;`, [], () => {
      echo();
    });
  }
}
export default Database;
