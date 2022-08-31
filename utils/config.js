const allowedCors = [
  'https://movies.sok.nomoredomains.sbs',
  'http://movies.sok.nomoredomains.sbs',
  'http://localhost:3000',
];

const DEV_PORT = 3000;
const DEV_DATABASE_ADDRESS = 'mongodb://localhost:27017/moviesdb';
const DEV_SECRET_KEY = 'dev-secret';

module.exports = {
  allowedCors,
  DEV_PORT,
  DEV_DATABASE_ADDRESS,
  DEV_SECRET_KEY,
};
