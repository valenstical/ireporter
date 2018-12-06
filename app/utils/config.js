
// HTTP STATUS
const STATUS_OK = 200;
const STATUS_CREATED = 201;
const STATUS_NO_CONTENT = 204; // FOR DELETE REQUETS
const STATUS_NOT_FOUND = 404; // ENTRY OK BUT RECORD NOT FOUND
const STATUS_UNPROCESSED = 422; // INVALID ENTRY
const STATUS_BAD_REQUEST = 400; // EMPTY FIELD

// INCIDENT STATUS
const INCIDENT_STATUS_DRAFT = 'draft';
const INCIDENT_STATUS_UNDER_INVESTIGATION = 'under investigation';
const INCIDENT_STATUS_RESOLVED = 'resolved';
const INCIDENT_STATUS_REJECT = 'rejected';
const MESSAGE_WELCOME_HOME = 'Welcome to iReporter. Are you an Hacker? Use our endpoint /api/v1 to interact with our service. Are you a Normal person? You can visit the site and click around.';
const MESSAGE_404 = 'Resource not found!. Please check your link then try again.';
const MESSAGE_WELCOME_HACKER = 'Welcome Hacker! This is iReporter api v1.';

const success = (res, code, data) => {
  res.status(code).json({ status: code, data });
};

const error = (res, code, message) => {
  res.status(code).json({ status: code, error: message });
};


export default {
  success,
  error,
  STATUS_OK,
  STATUS_CREATED,
  STATUS_NO_CONTENT,
  STATUS_NOT_FOUND,
  STATUS_BAD_REQUEST,
  STATUS_UNPROCESSED,
  INCIDENT_STATUS_DRAFT,
  INCIDENT_STATUS_REJECT,
  INCIDENT_STATUS_RESOLVED,
  INCIDENT_STATUS_UNDER_INVESTIGATION,
  MESSAGE_WELCOME_HOME,
  MESSAGE_404,
  MESSAGE_WELCOME_HACKER,
};
