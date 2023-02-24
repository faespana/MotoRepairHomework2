const { Router } = require('express');
const { check } = require('express-validator');
const {
  findAllRepairs,
  findRepairById,
  createRepair,
  updateRepairById,
  desableRepairById,
} = require('../controllers/repairs.controllers');
const { protect } = require('../middlewares/auth.middlewares');
const { validRepairById } = require('../middlewares/repairs.middlewares');
const { validateFields } = require('../middlewares/validateField');

const router = Router();

router.get('', findAllRepairs);
router.get('/:id', validRepairById, findRepairById);

router.use(protect);

router.post(
  '',
  [
    check('date', 'The date is requiered').not().isEmpty(),
    check('date', 'The date must be a correct format').isDate(),
    check('userId', 'The userId is requiered').not().isEmpty(),
    check('userId', 'The must be a correct format').isNumeric(),
  ],
  validateFields,
  createRepair
);

router.patch(
  '/:id',
  [
    check('date', 'The date is requiered').not().isEmpty(),
    check('date', 'The date must be a correct format').isDate(),
    check('userId', 'The userId is requiered').not().isEmpty(),
    check('userId', 'The must be a correct format').isNumeric(),
  ],
  validateFields,
  validRepairById,
  updateRepairById
);

router.delete('/:id', validRepairById, desableRepairById);

module.exports = {
  RepairsRouter: router,
};
