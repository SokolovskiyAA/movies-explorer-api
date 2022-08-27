const status = require('../utils/status');

class UnAuthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = status.UNAUTHORIZED;
  }
}

module.exports = UnAuthorizedError;
