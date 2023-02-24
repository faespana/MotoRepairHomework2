const { Router } = require('express');
const { check } = require('express-validator');
const {
  findAllUsers,
  findUserById,
  updateUserById,
  desableUserById,
  updatePassword,
} = require('../controllers/users.controller');
const {
  protect,
  protectAccountOwner,
} = require('../middlewares/auth.middlewares');
const {
  validUserById,
  validIfExistUserEmail,
} = require('../middlewares/users.middlewares');
const { validateFields } = require('../middlewares/validateField');

const router = Router();

router.get('', findAllUsers);
router.get('/:id', validUserById, findUserById);

router.use(protect);

router.patch(
  '/:id',
  [
    check('name', 'The name is requiered').not().isEmpty(),
    check('email', 'The email is requiered').not().isEmpty(),
    check('email', 'The email must be a correct format').isEmail(),
  ],
  validateFields,
  validUserById,
  protectAccountOwner,
  updateUserById
);

router.patch(
  '/password/:id',
  [
    check('currentPassword', 'The current password must be mandatory')
      .not()
      .isEmpty(),
    check('newPassword', 'The new password must be mandatory').not().isEmpty(),
    validateFields,
    validUserById,
    protectAccountOwner, //verifica un usuario
  ],
  updatePassword
);

router.delete('/:id', validUserById, protectAccountOwner, desableUserById);

module.exports = {
  UsersRouter: router,
};
