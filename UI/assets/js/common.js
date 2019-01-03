/* eslint-disable no-param-reassign */
// const ROOT = 'https://ireporter-nigeria.herokuapp.com/api/v1';

const ROOT = 'http://localhost:3000/api/v1';
let menuHidable = true;

class User {
  /**
     * Save the user object into local storage
     * @param {object} user - The user object
     */
  static setUser(user) {
    localStorage.setItem('user', user);
  }

  /**
   * Gets the user object from local storage
   */
  static getUser() {
    return localStorage.getItem('user');
  }

  /**
   * Save the JWT authorization token in local storage
   * @param {string} token - The JWT authorization token
   */
  static setToken(token) {
    localStorage.setItem('token', token);
  }

  /**
   * Retrieves the JWT authorization token from local storage
   */
  static getToken() {
    return localStorage.getToken('token');
  }

  /**
   * Logs in the user by saving both the token and user objects in local storage
   * @param {object} data - Object containing the token and user keys
   */
  static login(data) {
    User.setToken(data.token);
    User.setUser(data.user);
  }

  /**
   * Logs out the user by clearing the local storage
   */
  static logout() {
    localStorage.clear();
  }
}

const CONSTANTS = {
  URL: {
    LOGIN: `${ROOT}/auth/login`,
    SIGNUP: `${ROOT}/auth/signup`,
    RED_FLAGS: `${ROOT}/red-flags`,
    INTERVENTIONS: `${ROOT}/interventions`,
  },
  STATUS: {
    OK: 200,
    CREATED: 201,
    NOT_FOUND: 404,
    FORBIDDEN: 403,
    UNAUTHORIZED: 402,
    BAD_REQUEST: 400,
  },
  PAGE: {
    HOME: './index.html',
    ADMIN_LOGIN: './admin-login.html',
    ADMIN_DASHBOARD: './admin-dashboard.html',
    CREATE_REPORT: './create-report.html',
    EDIT_REPORT: './edit-report.html',
    PROFILE: './profile.html',
    REPORT_DETAILS: './report-details.html',
    USER_DASHBOARD: './user-dashboard.html',
    LOGIN: './sign-in.html',
  },
};

/**
 * Loads a new page with the give url
 * @param {string} page - url of the page
 */
function goto(page) {
  window.location.assign(page);
}
/**
 * Logs out the user and redirect to the sign in page
 */
function logout() {
  User.logout();
  goto(CONSTANTS.PAGE.LOGIN);
}

Wigi('[data-toggle]').click((event) => {
  Wigi(event.currentTarget).parent().toggleClass('shown');
  event.stopPropagation();
});

Wigi(window).click(() => {
  Wigi('.toggle.shown').removeClass('shown');
});

function toggleMenu() {
  Wigi('#nav-section').toggleClass('nav-hidden');
}

function hideMenu() {
  if (menuHidable) {
    Wigi('#nav-section').addClass('nav-hidden');
  }
}

function setMenuHidable(hidable) {
  menuHidable = hidable;
}
