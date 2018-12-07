import Config from '../utils/config';
import data from '../database/incidents';

const { success, error } = Config;
class ControlGet {
  static getIncidents(req, res) {
    const { type } = req.params;
    const result = data.filter(item => item.type === type);
    success(res, Config.STATUS_OK, result);
  }

  static getIncident(req, res) {
    const { id, type } = req.params;
    const result = data.filter(item => item.id === id && item.type === type);
    if (result.length === 0) {
      error(res, Config.STATUS_NOT_FOUND, Config.MESSAGE_NOT_FOUND);
    } else {
      success(res, Config.STATUS_OK, result);
    }
  }
}

export default ControlGet;
