import validator from 'validator';

const Helper = {
  /**
   * Detects empty or missing values
   * @param {array} errors - An array used to hold the error messages
   * @param {string} value - The value to validate
   * @param {string} message - The error message to display
   */
  checkEmpty: (errors, value, message) => {
    if (!value || validator.isEmpty(value.trim())) {
      errors.push(message);
    }
  },

  /**
   * Validates the latitude and longitude value pair
   * @param {array} errors - An array used to hold the error messages
   * @param {string} value - The value to validate
   */
  checkLocation: (errors, value) => {
    if (errors.length === 0 && !validator.isLatLong(value)) {
      errors.push('Please check that you have provided valid longitude and latitude');
    }
  },
};

export default Helper;
