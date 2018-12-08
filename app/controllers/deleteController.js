import Config from '../utils/config';
import _data from '../database/incidents';

const data = _data;
const { success, error } = Config;

class ControlDelete {
  static deleteIncident(req, res) {
    const { incident } = req.body;
    let index = -1;
    const result = data.find((item, pos) => {
      index = pos;
      return item.id === incident.id && item.type === incident.type;
    });
    if (!result) {
      error(res, Config.STATUS_NOT_FOUND, Config.MESSAGE_DATA_NOT_FOUND);
    } else {
      data.splice(index, 1);
      success(res, Config.STATUS_OK, [{ id: incident.id, message: `${incident.type} record has been deleted` }]);
    }
  }
}

export default ControlDelete;
