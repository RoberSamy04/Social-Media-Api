const { StatusCodes } = require("http-status-codes");

module.exports = globalErrorHandler = async (error, req, res, next) => {
  error.status = error.status || "error";
  error.statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

  res.status(error.statusCode).json({
    status: error.status,
    error,
    message: error.message,
    errorStack: error.stack,
  });
};
