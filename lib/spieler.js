const expressValidator = require('express-validator');
const { check, validationResult } = require('express-validator/check');
const log = require("metalogger")();

class Spieler {

  constructor(customProcessorFunc) {
    if (processorFunc == null) {
      this.processorFunc = this.processErrors;
    } else {
      this.processorFunc = customProcessorFunc;
    }

    this.expressValidator = expressValidator;

    return this.spieler;
  }

  validate() {
    const middleware = (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const err = new Error();
        err.message = "Validation Error";
        err.type = "validation";
        err.details = this.processorFunc.call(null, errors.mapped());
        throw err;
      } else {
        return next();
      }
    };

    return middleware;
  }

  processErrors(errorDetails) {
    const newDetails = [];
    Object.keys(errorDetails).forEach( (prop) => {
      newDetails.push(errorDetails[prop].msg);
    });
    return newDetails;
  }

  spieler (middlewareValidationRules) {
    middlewareValidationRules.push(this.validate);
  }

}

module.exports = (customProcessorFunc) => {
  if (customProcessorFunc) {
    return new Spieler(customProcessorFunc);
  } else {
    return new Spieler();
  }
}
