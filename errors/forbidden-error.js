const status = require('../utils/status');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = status.FORBIDDEN;
  }
}

module.exports = ForbiddenError;
