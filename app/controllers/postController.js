import Config from '../utils/config';
import _data from '../database/incidents';

const data = _data;

const { success } = Config;
class ControlPost {
  static createIncident(req, res) {
    const { incident } = req.body;
    incident.id = data.length + 1;
    data.push(incident);
    success(res, Config.STATUS_CREATED, [{ id: incident.id, message: `Created new ${incident.type} record` }]);
  }
}

export default ControlPost;
