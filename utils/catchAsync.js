const catchAsync = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(
      next /*err => next(err) tambien se puede usar asi*/
    );
  };
};

module.exports = catchAsync;
