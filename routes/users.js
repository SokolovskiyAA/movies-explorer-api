const usersRouter = require('express').Router();
const user = require('../controllers/users');
const { updateUserValidator } = require('../middlewares/validation');

usersRouter.get('/users/me', user.getUser);

usersRouter.patch('/users/me', updateUserValidator, user.updateUser);

module.exports = usersRouter;
