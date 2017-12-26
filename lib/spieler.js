const expressValidator = require('express-validator');
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
const log = require("metalogger")();

let processorFunc;

function processErrors(errorDetails) {
  const newDetails = [];
  Object.keys(errorDetails).forEach( (prop) => {
    newDetails.push(errorDetails[prop].msg);
  });
  return newDetails;
}

function validationMiddleware(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error();
    err.message = "Validation Error";
    err.type = "validation";
    err.details = processorFunc.call(null, errors.mapped());
    return next(err);
  } else {
    return next();
  }
}

function spieler(middlewareValidationRules) {
  middlewareValidationRules.push(validationMiddleware);
  return middlewareValidationRules;
}


module.exports = (customProcessorFunc) => {

  if (customProcessorFunc == null) {
    processorFunc = processErrors;
  } else {
    processorFunc = customProcessorFunc;
  }

  const expObj = {};
  expObj.spieler = spieler;
  expObj.expressValidator = expressValidator;
  expObj.check = check;
  expObj.validationResult = validationResult;
  expObj.matchedData = matchedData,
  expObj.sanitize = sanitize;

  return expObj;
}
