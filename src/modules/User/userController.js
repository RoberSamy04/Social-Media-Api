const { StatusCodes } = require("http-status-codes");
const User = require("../../models/userModel");
const catchAsync = require("../../utils/catchAsync");
const ApiError = require("../../utils/ApiError");

const getUser = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError("User Not Found", StatusCodes.NOT_FOUND);
  }

  res.status(StatusCodes.OK).json({
    status: "success",
    data: {
      user,
    },
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(StatusCodes.OK).json({
    status: "success",
    result: users.length,
    data: {
      users,
    },
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    throw new ApiError("No User found with that ID", StatusCodes.NOT_FOUND);
  }

  res.status(StatusCodes.NO_CONTENT).json({
    status: "success",
    data: null,
  });
});

const updateMe = catchAsync(async (req, res) => {
  const { name, email } = req.body;
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { name, email },
    { runValidators: true, new: true }
  );
  res.status(StatusCodes.OK).json({
    status: "success",
    data: {
      updatedUser,
    },
  });
});

const getMyProfile = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(StatusCodes.OK).json({
    status: "success",
    data: {
      user,
    },
  });
});

module.exports = { getUser, getAllUsers, deleteUser, updateMe, getMyProfile };
