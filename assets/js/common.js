/* eslint-disable no-param-reassign */
const ROOT = 'https://ireporter-nigeria.herokuapp.com';

// const ROOT = 'http://localhost:3000';
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
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) : null;
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
    return localStorage.getItem('token');
  }

  /**
   * Logs in the user by saving both the token and user objects in local storage
   * @param {object} data - Object containing the token and user keys
   */
  static login(data) {
    User.setToken(data.token);
    User.setUser(JSON.stringify(data.user));
  }

  /**
   * Logs out the user by clearing the local storage
   */
  static logout() {
    localStorage.clear();
  }
}

class Incident {
  constructor(data) {
    this.id = data.id;
    this.createdOn = data.createdOn;
    this.createdBy = data.createdBy;
    this.type = data.type;
    this.location = data.location;
    this.status = data.status;
    this.Images = data.Images;
    this.Videos = data.Videos;
    this.comment = data.comment;
    this.title = data.title;
    this.risk = data.risk;
  }

  getTime(now) {
    return ago(new Date(this.createdOn).getTime(), now);
  }
}

const CONSTANTS = {
  URL: {
    LOGIN: `${ROOT}/api/v1/auth/login`,
    SIGNUP: `${ROOT}/api/v1/auth/signup`,
    RED_FLAGS: `${ROOT}/api/v1/red-flags`,
    INTERVENTIONS: `${ROOT}/api/v1/interventions`,
    INCIDENTS: `${ROOT}/api/v1/incidents`,
  },
  STATUS: {
    OK: 200,
    CREATED: 201,
    NOT_FOUND: 404,
    FORBIDDEN: 403,
    UNAUTHORIZED: 402,
    BAD_REQUEST: 400,
  },
  INCIDENT: {
    DRAFT: 'draft',
    RESOLVED: 'resolved',
    REJECTED: 'rejected',
    INVESTIGATING: 'under investigation',
    RED_FLAG: 'red-flag',
    INTERVENTION: 'intervention',
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
  MESSAGE: {
    ERROR: ['Please check your internet connection. If the problem continues, try again at a later time or contact us for further assistance.'],
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

/**
 * Shows or hides toggle menu, aka dropdown menu
 * @param {object} event
 */
function showToggleMenu(event) {
  const menu = Select(event.currentTarget).parent();
  const isShowing = menu.hasClass('shown');
  Select('.toggle').removeClass('shown');
  if (!isShowing) {
    menu.addClass('shown');
  }
  event.stopPropagation();
}

function toggleCollapse(event) {
  event.preventDefault();
  const element = Select(event.currentTarget);
  const component = Select(element.prop('href'));
  element.html(component.hasClass('in') ? 'Show details' : 'Hide details');
  component.toggleClass('in');
  if (component.hasClass('in')) {
    setTimeout(() => { component.scrollToElement(); }, 500);
  } else {
    setTimeout(() => { component.parent().parent().parent().scrollToElement(false); }, 0);
  }
}

function scaleHeight(selector) {
  const element = Select(selector);
  element.height(Math.round((9 / 16) * element.width()));
}

Select('[data-collapse]').click((event) => {
  toggleCollapse(event);
});

Select('[data-toggle]').click((event) => {
  showToggleMenu(event);
});

Select(window).click(() => {
  Select('.toggle.shown').removeClass('shown');
});

function toggleMenu() {
  Select('#nav-section').toggleClass('nav-hidden');
}

function hideMenu() {
  if (menuHidable) {
    Select('#nav-section').addClass('nav-hidden');
  }
}

function setMenuHidable(hidable) {
  menuHidable = hidable;
}
function toggleLoader() {
  Select('.btn-submit img').toggleClass('hidden');
  Select('.btn-submit').toggleProp('disabled', 'true');
}

function echo(title, response) {
  let items = '';
  response.forEach((message) => {
    items = items.concat(`<li>${message}</li>`);
  });
  const result = `  
<div class="alert">
  <h4>${title}</h4>
  <ol class="unstyled-list">
    ${items}
  </ol>
</div>`;
  Select('#resultPane').html(result);
  return result;
}

/**
 * Helper function to send requests to API endpoint
 * @param {string} method - Method to use, post, get, patch or delete
 * @param {string} param - The parameters to send
 * @param {function} success - Function to execute on success
 * @param {function} error  - Function to execute on error
 * @param {function} lastly - Function to always execute
 */
function queryAPI(url, method, param, success, error, lastly) {
  fetch(url, {
    method,
    body: param,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${User.getToken()}`,
    },
  }).then(response => response.json()).then((json) => {
    success(json);
  })
    .catch((err) => {
      if (error) {
        error(err);
      } else {
        alert(CONSTANTS.MESSAGE.ERROR.toString());
      }
    })
    .finally(() => {
      if (lastly) {
        lastly();
      }
    });
}
/**
 * Display the user icon
 */
function showIcon() {
  const user = User.getUser();
  const profileImage = document.getElementsByClassName('user-image');
  profileImage[0].src = `assets/images/profiles/${user.profile}`;
  profileImage[1].src = `assets/images/profiles/${user.profile}`;
  document.getElementById('userName').innerHTML = `${user.firstname} ${user.othernames} ${user.lastname}`;
  document.getElementById('userEmail').innerHTML = user.email;
}

function ago(time, now) {
  const periods = ['second', 'minute', 'hour', 'day', 'week', 'month', 'year', 'decade'];
  const lengths = [60, 60, 24, 7, 4.35, 12, 10];

  let difference = (now - time) / 1000;

  const len = lengths.length;
  let j;
  for (j = 0; difference >= lengths[j] && j < len - 1; j += 1) {
    difference /= lengths[j];
  }

  difference = Math.round(difference);

  if (difference !== 1) {
    periods[j] += 's';
  }

  return `${difference} ${periods[j]}`;
}

/**
 * Setup the page
 */
function init() {
  showIcon();
}
