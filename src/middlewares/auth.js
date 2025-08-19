const { StatusCodes } = require("http-status-codes");
const ApiError = require("../utils/ApiError");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new ApiError(
      "You are not logged in ! Please log in to get access",
      StatusCodes.UNAUTHORIZED
    );
  }

  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const freshUser = await User.findById(decode.id);

  if (!freshUser) {
    throw new ApiError(
      "The user belonging to this token doesn't exists",
      StatusCodes.UNAUTHORIZED
    );
  }

  if (freshUser.changedPasswordAfter(decode.iat)) {
    throw new ApiError(
      "User recently changed password ! Please log in again",
      StatusCodes.UNAUTHORIZED
    );
  }

  req.user = freshUser;
  next();
};

const restrictTo =
  (...allowedRoles) =>
  (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(
        "you do not have permission to perform this action",
        StatusCodes.FORBIDDEN
      );
    }

    next();
  };

module.exports = { protect, restrictTo };
