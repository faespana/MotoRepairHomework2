const User = require('../models/user.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.validUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findOne({
    where: {
      id,
      status: 'available',
    },
  });

  if (!user) {
    return next(new AppError('The user was not found', 404));
  }

  req.user = user;
  next();
});

exports.validIfExistUserEmail = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({
    where: {
      email: email.toLowerCase(),
    },
  });

  if (user && user.status === 'disabled') {
    await user.update({ status: 'available' });

    return next(
      new AppError('User had a disabled account, now is available', 400)
    );
  }

  if (user) {
    return next(new AppError('The email user already exist'), 400);
  }

  next();
});
