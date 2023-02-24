const { Router } = require('express');
const { check } = require('express-validator');
const { createUser, login } = require('../controllers/auth.controllers');
const { validIfExistUserEmail } = require('../middlewares/users.middlewares');
const { validateFields } = require('../middlewares/validateField');

const router = Router();

router.post(
  '/signup',
  [
    check('name', 'The name is requiered').not().isEmpty(),
    check('email', 'The email is requiered').not().isEmpty(),
    check('email', 'The email must be a correct format').isEmail(),
    check('password', 'The password is requiered').not().isEmpty(),
  ],
  validateFields,
  validIfExistUserEmail,
  createUser
);

router.post(
  '/login',
  [
    check('email', 'The email is requiered').not().isEmpty(),
    check('email', 'The email must be a correct format').isEmail(),
    check('password', 'The password is requiered').not().isEmpty(),
    validateFields,
  ],
  login
);

module.exports = {
  authRouter: router,
};
