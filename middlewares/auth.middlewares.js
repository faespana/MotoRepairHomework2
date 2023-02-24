const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user.model');

exports.protect = catchAsync(async (req, res, next) => {
  //1. Obtener el token y revisarlo

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401)
    );
  }

  //2. Verificar el token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.SECRET_JWT_SEED
  );

  //3. Verificar que el usuario exista

  const user = await User.findOne({
    where: {
      id: decoded.id,
      status: 'available',
    },
  });

  if (!user) {
    return next(
      new AppError('The owner of this token it not longer available', 401)
    );
  }
  //4. Verificar si el usuario ha cambiado la contraseña despues de que el token haya expirado.

  if (user.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      user.passwordChangedAt.getTime() / 1000,
      10 /*division base 10*/
    );

    if (decoded.iat < changedTimeStamp) {
      return next(
        new AppError('User recently changed password!, please login again', 401)
      );
    }
  }

  req.sessionUser = user;

  /*Tiempo en que se creo el token 1676918516*/
  // console.log(decoded.iat);
  /*Esto es el tiempo en que se cambio de contrasena 1676918484214*/
  // console.log(user.passwordChangedAt.getTime());

  next();
});

//Esto se hace siempre que la contrasena quiera ser actualizada, antes lo podia hacer cualquiera
exports.protectAccountOwner = catchAsync(async (req, res, next) => {
  const { user, sessionUser /*este es el dueno del token*/ } = req;

  if (user.id !== sessionUser.id) {
    return next(new AppError('You do not own this account', 401));
  }
  next();
});
