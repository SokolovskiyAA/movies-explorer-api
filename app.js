require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const rateLimit = require('express-rate-limit');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { allowedCors } = require('./utils/config');

const { PORT = 3001, DATABASE_ADDRESS = 'mongodb://localhost:27017/moviesdb' } = process.env;
const app = express();

mongoose.connect(`${DATABASE_ADDRESS}`, {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
  const { method } = req; // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную
  // Значение для заголовка Access-Control-Allow-Methods по умолчанию (разрешены все типы запросов)
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  // сохраняем список заголовков исходного запроса
  const requestHeaders = req.headers['access-control-request-headers'];
  // проверяем, что источник запроса есть среди разрешённых
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    // Если это предварительный запрос, добавляем нужные заголовки
    if (method === 'OPTIONS') {
      // разрешаем кросс-доменные запросы любых типов (по умолчанию)
      res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
      // разрешаем кросс-доменные запросы с этими заголовками
      res.header('Access-Control-Allow-Headers', requestHeaders);
      // завершаем обработку запроса и возвращаем результат клиенту
      return res.end();
    }
  }
  return next();
});

app.use(requestLogger);

// Ограничение количества запросов в единицу времени
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
});

app.use(limiter);

app.use(helmet());

app.use('/', require('./routes'));

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'Внутренняя ошибка сервера' : message });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
