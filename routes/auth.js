const router = require('express').Router();
const { createUser, login } = require('../controllers/users');
const { createUserValidator, signinValidator } = require('../middlewares/validation');

// Роуты не требующие авторизации
router.post('/signup', createUserValidator, createUser);

router.post('/signin', signinValidator, login);

module.exports = router;
