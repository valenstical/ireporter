import { Pool } from 'pg';
import dotenv from 'dotenv';
import Config from './config';

dotenv.config();
const pool = new Pool();

class Database {
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
      failure(ex);
    });
  }

  static deleteIncident(incident, echo) {
    const sql = 'delete from incidents where type = $1 and id =$2 and status = $3';
    const params = [incident.type, incident.id, Config.INCIDENT_STATUS_DRAFT];
    Database.execute(sql, params, (query) => {
      echo(query.rowCount > 0);
    });
  }

  static clearIncidents(echo) {
    const sql = 'delete from incidents';
    Database.execute(sql, [], (query) => {
      echo(query.rowCount > 0);
    });
  }
}

export default Database;
