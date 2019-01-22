const Constants = {

  // HTTP STATUS
  STATUS_OK: 200,
  STATUS_CREATED: 201,
  STATUS_NO_CONTENT: 204, // FOR DELETE REQUETS
  STATUS_NOT_FOUND: 404, // ENTRY OK BUT RECORD NOT FOUND
  STATUS_UNPROCESSED: 422, // INVALID ENTRY
  STATUS_BAD_REQUEST: 400, // EMPTY FIELD
  STATUS_PARTIAL_CONTENT: 206, // MISSING FIELD
  STATSUS_CONFLICT: 409,
  STATUS_UNATHORIZED: 401,
  STATUS_FORBIDDEN: 403,
  STATUS_SERVER_ERROR: 500,

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
  MESSAGE_BAD_COMMENT: 'The comment field is required',
  MESSAGE_BAD_TITLE: 'The title field is required',
  MESSAGE_BAD_TYPE: 'Please choose the type of report you wish to make',
  MESSAGE_INVALID_TYPE: 'You have entered  invalid report type',
  MESSAGE_INVALID_ID: 'The id must be a number',
  MESSAGE_DATA_NOT_FOUND: 'There is no record matching that id',
  MESSAGE_BAD_DATA_STATUS: 'You have entered an invalid status for the incident',
  MESSAGE_OUT_OF_RANGE: 'The id should be 9 digits long',
  MESSAGE_EMPTY_STATUS: 'You must provide a status in order to proceed',
  MESSAGE_INVALID_LOGIN: 'Username or password is incorrect',
  MESSAGE_UNATHORIZED: 'You do not have permission to access this resource',
  MESSAGE_FORBIDDEN: 'You need admin privileges to change the status of a report',
  MESSAGE_NO_PASSWORD: 'You need to provide a password',
  MESSAGE_NO_USERNAME: 'Your username is required. You can also provide your phone number or email address.',
  MESSAGE_NO_FIRST_NAME: 'You need to provide your first name',
  MESSAGE_NO_LAST_NAME: 'You need to provide your last name (surname)',
  MESSAGE_NO_EMAIL_ADDRESS: 'You need to provide a valid email address',
  MESSAGE_NO_SIGNUP_USERNAME: 'You need choose a username',
  MESSAGE_NO_PHONE_NUMBER: 'You need to provide a valid phone number',
  MESSAGE_DUPLICATE_PHONE_NUMBER: 'A user with that phone number already exists',
  MESSAGE_DUPLICATE_EMAIL: 'The email address you entered is already registered',
  MESSAGE_DUPLICATE_USERNAME: 'It appears like the username you chose is already taken.',
  MESSAGE_LONG_COMMENT: 'The comment is too long. Please limit your comment to 1000 characters.',
  MESSAGE_LONG_TITLE: 'The title is too long. Please limit the title to 100 characters.',
  MESSAGE_BAD_LONGITUDE: 'The longitude is required',
  MESSAGE_BAD_LATITUDE: 'The latitude is required',
  MESSAGE_PASSWORD_CHANGED: 'Your password has been updated.',
  MESSAGE_IMAGE_UPLOADED: 'Image uploaded successfully',
  MESSAGE_VIDEO_UPLOADED: 'Video uploaded successfully',
  MESSAGE_NO_FILE: 'Please choose a file',
  MESSAGE_NOT_IMAGE: 'Please choose a valid image. Image can be jpeg, jpg, gif or png',
  MESSAGE_NOT_VIDEO: 'Please choose a valid video. Video must be in mp4 format',
  MESSAGE_IMAGE_TOO_LARGE: 'Image is too large. The image size should not exceed 2MB',
  MESSAGE_VIDEO_TOO_LARGE: 'Video is too large. The video size should not exceed 100MB. You can split the video into smaller bits and send seperately.',
  MESSAGE_SERVER_ERROR: 'An internal error has occured. This is not your fault. We are working to fix this problem. Please try again later.',
  TEXT_LONG: 'This is a very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very long sentence with plenty characters.',

  // INCIDENT TYPES
  INCIDENT_TYPE_RED_FLAG: 'red-flag',
  INCIDENT_TYPE_INTERVENTION: 'intervention',
  INCIDENT_TYPE_ALL: 'incident',
  INCIDENT_ROUTE_RED_FLAG: 'red-flags',
  INCIDENT_ROUTE_INTERVENTION: 'interventions',
  INCIDENT_ROUTE_ALL: 'incidents',

  // SQL RESULT SET LIMIT
  SQL_LIMIT: 50,

  TEST_DUMMY_USER: {
    firstname: 'Test',
    lastname: 'User',
    email: 'tester@ireporter.com',
    phoneNumber: '08123456789',
    othernames: 'Mocha',
    username: 'tester',
    password: '123',
    registered: new Date(),
    isAdmin: false,
    profile: 'default.jpg',
    isVerified: true,
    isBlocked: false,
    allowSms: true,
    allowEmail: true,
    id: 123456789,
  },
  TEST_DUMMY_INCIDENT: {
    id: 123456789,
    createdOn: new Date(),
    createdBy: 123456789,
    type: 'red-flag',
    location: '6.2345678,3.2340785',
    status: 'draft',
    Images: [],
    Videos: [],
    comment: 'This is the comment',
    title: 'This is the title',
    risk: 0,
  },
  TEST_DUMMY_LOCATION: {
    longitude: '6.0987345',
    latitude: '3.2954875',
  },
  TEST_DUMMY_COMMENT: {
    comment: 'This is a comment',
    title: 'This is the title',
  },
  SQL_CREATE_TABLES: `CREATE TABLE IF NOT EXISTS public.incidents
  (
    id integer NOT NULL,
    "createdOn" timestamp without time zone,
    type character varying(15) NOT NULL,
    location character varying(100) NOT NULL,
    title character varying(100) NOT NULL,
    comment character varying(1000),
    "createdBy" integer,
    status character varying(20),
    risk smallint,
    "Images" character varying(255)[],
    "Videos" character varying(255)[],
    state character varying(50),
    CONSTRAINT incidents_pkey PRIMARY KEY (id),
    CONSTRAINT "incidents.fkey" FOREIGN KEY ("createdBy")
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION ON DELETE NO ACTION
  )
  WITH (
    OIDS=FALSE
  );CREATE TABLE IF NOT EXISTS public.users
  (
    id integer NOT NULL,
    firstname character varying(100),
    lastname character varying(100),
    othernames character varying(100),
    username character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    email character varying(100),
    "phoneNumber" character varying(20),
    registered timestamp without time zone,
    "isAdmin" boolean DEFAULT false,
    profile character varying(100),
    "isVerified" boolean DEFAULT false,
    "isBlocked" boolean DEFAULT false,
    "allowSms" boolean DEFAULT true,
    "allowEmail" boolean DEFAULT true,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_phone_key UNIQUE ("phoneNumber"),
    CONSTRAINT users_username_key UNIQUE (username)
  )
  WITH (
    OIDS=FALSE
  );`,
};

export default Constants;
