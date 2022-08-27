const status = require('../utils/status');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = status.NOTFOUND;
  }
}

module.exports = NotFoundError;
