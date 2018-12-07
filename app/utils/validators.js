import validator from 'validator';

class Validator {
  static hasEmpty(values) {
    return values.some(item => item.toString().trim() === '');
  }

  static isEmpty(item) {
    return item.toString().trim() === '';
  }

  static isValidLocation(longitude, latitude) {
    return validator.isLatLong(`${latitude},${longitude}`);
  }

  static isIncident(type) {
    return type === 'red-flag' || type === 'intervention';
  }
}

export default Validator;
