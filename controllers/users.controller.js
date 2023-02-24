const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcryptjs');
const AppError = require('../utils/appError');

exports.findAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    attributes: ['id', 'name', 'email'],
    where: {
      status: 'available',
    },
  });

  res.status(200).json({
    status: 'success',
    message: 'The users were found successfully',
    users,
  });
});

exports.findUserById = catchAsync(async (req, res, next) => {
  const { user } = req;

  res.status(200).json({
    status: 'success',
    message: 'The user was found successfully',
    user,
  });
});

exports.updateUserById = catchAsync(async (req, res, next) => {
  const { user } = req;

  const { name, email } = req.body;

  const updatedUser = await user.update({
    name,
    email,
  });

  res.status(200).json({
    status: 'success',
    massagge: 'The user has been updated successfully',
    updatedUser,
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { currentPassword, newPassword } = req.body;

  if (!(await bcrypt.compare(currentPassword, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const salt = await bcrypt.genSalt(10);
  const encriptedPassword = await bcrypt.hash(newPassword, salt);

  await user.update({
    password: encriptedPassword,
    passwordChangedAt: new Date(),
  });

  res.status(200).json({
    status: 'success',
    message: 'The user password was updated successfully',
  });
});

exports.desableUserById = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: 'disabled' });

  res.status(200).json({
    status: 'success',
    massagge: 'The user has been disabled',
  });
});
