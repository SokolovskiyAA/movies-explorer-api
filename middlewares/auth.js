const jwt = require('jsonwebtoken');
const UnAuthorizedError = require('../errors/unauth-error');

const handleAuthError = (next) => next(new UnAuthorizedError('Необходимо авторизоваться'));

const extractBearerToken = (header) => header.replace('Bearer ', '');

const { NODE_ENV, JWT_SECRET = 'dev-secret' } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(next);
  }

  const token = extractBearerToken(authorization);
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return handleAuthError(next);
  }

  req.user = payload;

  return next();
};
