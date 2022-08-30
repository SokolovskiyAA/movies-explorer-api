const router = require('express').Router();
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-error');


router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// Роуты авторизации / регистрации, не требующие токена
router.use('/', require('./auth'));

// авторизация
router.use(auth);

// роуты, которым авторизация нужна
router.use('/', require('./users'));
router.use('/', require('./movies'));

router.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

module.exports = router;
