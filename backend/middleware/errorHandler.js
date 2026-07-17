function errorHandler(err, _req, res, _next) {
  console.error('[ERROR]', err.stack || err.message);

  if (err.name === 'MulterError') {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  const status = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : err.message;

  res.status(status).json({
    success: false,
    message,
  });
}

module.exports = errorHandler;
