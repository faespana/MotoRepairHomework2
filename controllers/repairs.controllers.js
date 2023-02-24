const Repair = require('../models/repair.model');
const catchAsync = require('../utils/catchAsync');

exports.findAllRepairs = catchAsync(async (req, res, next) => {
  const repairs = await Repair.findAll({
    attributes: ['id', 'date', 'userId'],
    where: {
      status: 'pending',
    },
  });
  res.status(200).json({
    status: 'success',
    messagge: 'The repairs were found successfully',
    repairs,
  });
});

exports.findRepairById = catchAsync(async (req, res, next) => {
  const { repair } = req;

  res.status(200).json({
    status: 'success',
    message: 'The repair was found successfully',
    repair,
  });
});

exports.createRepair = catchAsync(async (req, res, next) => {
  const { date, userId } = req.body;

  const newRepair = await Repair.create({
    date,
    userId,
  });

  res.status(201).json({
    status: 'success',
    messagge: 'The repair was created successfully',
    newRepair,
  });
});

exports.updateRepairById = catchAsync(async (req, res, next) => {
  const { repair } = req;

  const { date, userId } = req.body;

  const updatedRepair = await repair.update({
    date,
    userId,
  });

  res.status(200).json({
    status: 'success',
    messagge: 'The repair has been updated successfully',
    updatedRepair,
  });
});

exports.desableRepairById = catchAsync(async (req, res, next) => {
  const { repair } = req;

  await repair.update({ status: 'cancelled' });

  res.status(200).json({
    status: 'success',
    messagge: 'The repair has been cancelled',
  });
});
