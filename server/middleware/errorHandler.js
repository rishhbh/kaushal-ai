const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? (res.statusCode === 200 ? 500 : res.statusCode) : 500;
  console.error(err.stack);
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = errorHandler;
