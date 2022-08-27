const status = require('../utils/status');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = status.CONFLICT;
  }
}

module.exports = ConflictError;
