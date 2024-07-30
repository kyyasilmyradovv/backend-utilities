// This function could be used as a middleware on post & put & patch routes
// Checks the inputs of request body

const { validate } = require('uuid');
const validator = require('validator');
const AppError = require('../error/appError');

// Required fields for each models' create action (post method)
let requiredFields = {
  admin: ['username', 'name', 'surname', 'password', 'accesses'],
  user_signup: ['username', 'phone', 'password'],
  user_login: ['login', 'password'],
};

// Common Functions
let parentFunctions = {
  isString: function (value) {
    return typeof value === 'string';
  },
  isNumber: function (value) {
    return typeof value === 'number';
  },
  isInteger: function (value) {
    return Number.isInteger(value);
  },
  isFloat: function (value) {
    return typeof value === 'number' && !Number.isInteger(value);
  },
  isObject: function (value) {
    return typeof value === 'object';
  },
  isBoolean: function (value) {
    return typeof value === 'boolean' || ['true', 'false'].includes(value);
  },
  isDate: function (value) {
    return Date.parse(value);
  },
  isTime: function (value) {
    return (
      typeof value === 'string' && new RegExp('([01]?[0-9]|2[0-3]):[0-5][0-9]')
    );
  },
  isEmail: function (value) {
    return validator.isEmail(value);
  },
  isUuid: function (value) {
    return validate(value);
  },
  isArrayOfIntegers: function (value) {
    return Array.isArray(value) && value.every((e) => Number.isInteger(e));
  },
  isArrayOfStrings: function (value) {
    return Array.isArray(value) && value.every((e) => typeof e === 'string');
  },
  isArrayOfUuids: function (value) {
    return Array.isArray(value) && value.every((e) => validate(e));
  },
  isArrayOfObjects: function (value) {
    return (
      Array.isArray(value) && value.every((e) => typeof value === 'object')
    );
  },
  isScore: function (value) {
    return typeof value === 'number' && 0 <= value && value <= 10;
  },
};

// Validators for all input fields of all models combined
let typeCheckers = {
  // String validators
  name: parentFunctions.isString,
  surname: parentFunctions.isString,
  username: parentFunctions.isString,
  password: parentFunctions.isString,
  oldPassword: parentFunctions.isString,
  newPassword: parentFunctions.isString,
  // Number validators
  paymentAmount: parentFunctions.isNumber,
  verificationCode: parentFunctions.isNumber,
  // Score validators
  score: parentFunctions.isScore,
  rate: parentFunctions.isScore,
  // Boolean validators
  isActive: parentFunctions.isBoolean,
  isLocal: parentFunctions.isBoolean,
  // Date validators
  birthdate: parentFunctions.isDate,
  expirationDate: parentFunctions.isDate,
  // Uuid validators
  groupUuid: parentFunctions.isUuid,
  // Array of strings validators
  accesses: parentFunctions.isArrayOfStrings,
  // Array of uuids validators
  categoryUuids: parentFunctions.isArrayOfUuids,
};

exports.checkInputs = (model, action) => {
  return (req, res, next) => {
    let requiredFields_ = requiredFields[model];
    let requestBody = req.body;
    let requestKeys = Object.keys(requestBody);

    // Return error if all required fields are not provided, works for only create(post) requests
    if (
      action === 'create' &&
      !requiredFields_.every((e) => e in requestBody)
    ) {
      let notProvidedFields = requiredFields_.filter(
        (e) => !Object.keys(requestBody).includes(e)
      );
      return next(
        new AppError(
          `Invalid Credentials. Not provided fields: ${notProvidedFields.join(
            ', '
          )}`,
          400
        )
      );
    }

    // Return error if even one field is provided with invalid variable type or required field has null as value
    for (key of requestKeys) {
      if (
        !typeCheckers[key] ||
        (requestBody[key] === null && requiredFields_.includes(key)) ||
        (requestBody[key] !== null && !typeCheckers[key](requestBody[key]))
      ) {
        return next(new AppError(`Invalid credentials: ${key}`, 400));
      }
    }

    return next();
  };
};
