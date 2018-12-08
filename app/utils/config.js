
const Config = {

  // HTTP STATUS
  STATUS_OK: 200,
  STATUS_CREATED: 201,
  STATUS_NO_CONTENT: 204, // FOR DELETE REQUETS
  STATUS_NOT_FOUND: 404, // ENTRY OK BUT RECORD NOT FOUND
  STATUS_UNPROCESSED: 422, // INVALID ENTRY
  STATUS_BAD_REQUEST: 400, // EMPTY FIELD

  // INCIDENT STATUS
  INCIDENT_STATUS_DRAFT: 'draft',
  INCIDENT_STATUS_UNDER_INVESTIGATION: 'under investigation',
  INCIDENT_STATUS_RESOLVED: 'resolved',
  INCIDENT_STATUS_REJECTED: 'rejected',
  MESSAGE_WELCOME_HOME: 'Welcome to iReporter. Are you an Hacker? Use our endpoint /api/v1 to interact with our service. Are you a Normal person? You can visit the site and click around.',
  MESSAGE_NOT_FOUND: 'Resource not found!. Please check the url then try again.',
  MESSAGE_WELCOME_HACKER: 'Welcome Hacker! This is iReporter api v1.',

  // GENERAL MESSAGES
  MESSAGE_BAD_LOCATION: 'The location you entered is invalid. Please check your longitude and latitude, then try again.',
  MESSAGE_BAD_COMMENT: 'Please enter a title for this report',
  MESSAGE_BAD_TYPE: 'Please choose the type of report you wish to make',
  MESSAGE_INVALID_TYPE: 'You have entered  invalid report type',
  MESSAGE_INVALID_ID: 'The id must be a number',
  MESSAGE_DATA_NOT_FOUND: 'There is no record matching that id',
  // INCIDENT TYPES
  TYPE_RED_FLAG: 'red-flag',
  TYPE_INTERVENTION: 'intervention',

  success: (res, code, data) => {
    res.status(code).json({ status: code, data });
  },

  error: (res, code, message) => {
    res.status(code).json({ status: code, error: message });
  },
};

export default Config;
