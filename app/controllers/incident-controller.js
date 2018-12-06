import config from '../utils/config';

import Validator from '../utils/validators';

import incidents from '../models/incidents';

const getIncidents = () => incidents;

const getIncident = (id) => {
  const result = incidents.filter(item => item.id.toString() === id);
  return !result.length ? false : result;
};

function createIncident(id, body) {
  incidents.push(
    {
      id,
      createdOn: new Date(),
      createdBy: body.user,
      type: body.type,
      location: `${body.longitude},${body.latitude}`,
      status: config.INCIDENT_STATUS_DRAFT,
      Images: body.images.split(','),
      Videos: body.videos.split(','),
      comment: body.comment,
      description: body.description,
    },
  );
}

function updateIncident(id, longitude, latitude, comment) {
  let index = -1; let key = 'comment';
  const incident = incidents.find((item, pos) => {
    index = pos;
    return item.id.toString() === id.toString();
  });
  if (comment === null) {
    incident.longitude = longitude;
    incident.latitude = latitude;
    key = 'location';
  } else {
    incident.comment = comment;
  }
  incident[index] = incident;
  return `Updated ${incident.type}'s record ${key}.`;
}

function incidentExists(id) {
  return incidents.find(item => item.id === parseInt(id, 10)) !== undefined;
}


const addIncident = (body) => {
  let id = -1;
  let errorMessage = '';
  let code = config.STATUS_BAD_REQUEST;

  if (Validator.hasEmpty([body.comment, body.longitude, body.latitude])) {
    errorMessage = 'You must fill all required fields. Please check your inputs then try again';
  } else if (!Validator.isValidLocation(body.longitude, body.latitude)) {
    code = config.STATUS_UNPROCESSED;
    errorMessage = 'The location you entered is invalid. Please check your longitude and latitude, then try again.';
  } else if (body.type === undefined || !Validator.isIncident(body.type)) {
    errorMessage = 'Please choose the type of report you wish to make.';
  } else {
    id = incidents.length + 1;
    code = config.STATUS_CREATED;
    createIncident(id, body);
  }
  return { id: parseInt(id, 10), errorMessage, code };
};

const editLocation = (body, params) => {
  let result = -1;
  let message = '';
  let code = config.STATUS_OK;
  const { id } = params;
  const { longitude, latitude } = body;

  if (Validator.hasEmpty([longitude, latitude])) {
    code = config.STATUS_BAD_REQUEST;
    message = 'You must enter both longitude and latitude.';
  } else if (!Validator.isValidLocation(longitude, latitude)) {
    code = config.STATUS_UNPROCESSED;
    message = 'The location you entered is invalid. Please check your longitude and latitude, then try again.';
  } else if (!incidentExists(id)) {
    code = config.STATUS_NOT_FOUND;
    message = 'There is no incident report with that id. Please check the id then try again';
  } else {
    result = id;
    message = updateIncident(id, longitude, latitude, null);
  }
  return { id: parseInt(result, 10), message, code };
};

const editComment = (body, params) => {
  let result = -1;
  let message = '';
  let code = config.STATUS_OK;
  const { id } = params;
  const { comment } = body;

  if (Validator.isEmpty(comment)) {
    code = config.STATUS_BAD_REQUEST;
    message = 'You must enter a the title for the report you want to make.';
  } else if (!incidentExists(id)) {
    code = config.STATUS_NOT_FOUND;
    message = 'There is no incident report with that id. Please check the id then try again';
  } else {
    result = id;
    message = updateIncident(id, null, null, comment);
  }
  return { id: parseInt(result, 10), message, code };
};

const deleteIncident = (params) => {
  let result = -1;
  let message = '';
  let code = config.STATUS_OK;
  const { id } = params;

  if (!incidentExists(id)) {
    code = config.STATUS_NOT_FOUND;
    message = 'There is no red-flag record with that id. Please check the id then try again';
  } else {
    result = id; let index = -1;
    const incident = incidents.find((item, pos) => {
      index = pos;
      return item.id.toString() === id.toString();
    });
    incidents.splice(index, 1);
    message = `${incident.type} record has been deleted`;
  }
  return { id: parseInt(result, 10), message, code };
};

export default {
  getIncidents,
  getIncident,
  addIncident,
  editLocation,
  editComment,
  deleteIncident,
};
