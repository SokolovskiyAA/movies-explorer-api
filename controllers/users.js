const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/users');
const status = require('../utils/status');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');

const { NODE_ENV, JWT_SECRET = 'dev-secret' } = process.env;

// Получение информации о пользователе
module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.status(status.OK).send(user);
      } else {
        throw new NotFoundError('Пользователь не найден');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Введены некорректные данные'));
      } else {
        next(err);
      }
    });
};

// Обновить информацию о пользователе
module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findOneAndUpdate({ _id: req.user._id }, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.status(status.OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Введены некорректные данные'));
      } else if (err.code === 11000) {
        next(new ConflictError('Данный email уже используется'));
      } else {
        next(err);
      }
    });
};

// Авторизация
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

// Регистрация
module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => {
      res.status(status.CREATED).send({
        name: user.name,
        _id: user._id,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Введены некорректные данные'));
      } else if (err.code === 11000) {
        next(new ConflictError('Данный email уже используется'));
      } else {
        next(err);
      }
    })
    .catch(next);
};
