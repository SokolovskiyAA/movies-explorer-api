const status = require('../utils/status');

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = status.ERROR;
  }
}

module.exports = BadRequestError;
