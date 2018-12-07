import Config from '../utils/config';

class Incident {
  constructor() {
    this.id = -1;
    this.createdOn = new Date();
    this.createdBy = -1;
    this.type = '';
    this.location = '';
    this.status = Config.INCIDENT_STATUS_DRAFT;
    this.Images = [];
    this.Videos = [];
    this.comment = '';
    this.description = '';
  }

  isIncident() {
    return this.is(Config.TYPE_INTERVENTION) || this.is(Config.TYPE_RED_FLAG);
  }

  is(type) {
    return this.type === type;
  }

  setType(type) {
    this.type = type.substring(0, type.length - 1);
  }

  statusToString() {
    switch (this.status) {
      case 0:
        this.status = Config.INCIDENT_STATUS_DRAFT;
        break;
      case 1:
        this.status = Config.INCIDENT_STATUS_UNDER_INVESTIGATION;
        break;
      case 2:
        this.status = Config.INCIDENT_STATUS_RESOLVED;
        break;
      case 3:
        this.status = Config.INCIDENT_STATUS_REJECTED;
        break;
      default:
        this.status = false;
    }
  }
}


export default Incident;
