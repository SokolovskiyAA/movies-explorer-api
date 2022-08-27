const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const user = require('../controllers/users');

usersRouter.get('/users/me', user.getUser);

usersRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().email(),
  }),
}), user.updateUser);

module.exports = usersRouter;