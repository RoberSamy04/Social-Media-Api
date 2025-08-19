const { StatusCodes } = require("http-status-codes");
const tokenServices = require("../../utils/tokenService");
const User = require("../../models/userModel");
const catchAsync = require("../../utils/catchAsync");
const ApiError = require("../../utils/ApiError");
const Email = require("../../utils/email");
const otpService = require("../../utils/otpService");

const signup = catchAsync(async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const otp = await otpService.createOtpObject(newUser, "email");

  try {
    await new Email(newUser).sendOtp(otp.otpString, "email");
  } catch (error) {
    otpService.clearOtpProperties(newUser, "email");
    await newUser.save({ validateBeforeSave: false });
    throw new ApiError(
      "there an error sending an email",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  newUser.password = undefined;
  newUser.emailVerificationOtp = undefined;
  res.status(StatusCodes.CREATED).json({
    status: "success",
    data: {
      newUser,
    },
  });
});

const verifyEmailOtp = catchAsync(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError("User not Found", StatusCodes.NOT_FOUND);
  }

  if (user.isEmailVerified) {
    throw new ApiError("Email already Virefied", StatusCodes.BAD_REQUEST);
  }

  await user.verifyOtp(otp, "email"); //throws an error if the otp in incorrect or expired
  await user.save({ validateBeforeSave: false });

  res.status(StatusCodes.OK).json({
    status: "success",
    message: "Email verified successfully",
  });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(
      "Please provide an email and password",
      StatusCodes.BAD_REQUEST
    );
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePasswords(password, user.password))) {
    throw new ApiError("Incorrect email or password", StatusCodes.BAD_REQUEST);
  }

  if (!user.isEmailVerified) {
    throw new ApiError("Please confirm your Email", StatusCodes.UNAUTHORIZED);
  }

  tokenServices.createSendTokenViaCookie(res, StatusCodes.OK, user);
});

const changeMyPassword = catchAsync(async (req, res) => {
  const { currentPassword, password, passwordConfirm } = req.body;
  const user = await User.findById(req.user.id).select("+password");

  if (!(await user.comparePasswords(currentPassword, user.password))) {
    throw new ApiError("Incorrect Password", StatusCodes.UNAUTHORIZED);
  }

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();

  tokenServices.createSendTokenViaCookie(res, StatusCodes.OK, user);
});

const requestPasswordReset = catchAsync(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError("Email Not Found", StatusCodes.NOT_FOUND);
  }

  const otp = await otpService.createOtpObject(user, "password");

  try {
    await new Email(user).sendOtp(otp.otpString, "password");
  } catch (error) {
    otpService.clearOtpProperties(user, "password");
    throw new ApiError(
      "There an error sending an email, Please try again later",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "an OTP has been send to your Email",
  });
});

const verifyPasswordOtp = catchAsync(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError("User not Found", StatusCodes.NOT_FOUND);
  }

  await user.verifyOtp(otp, "password"); //throws an error if the otp in incorrect or expired
  await user.save({ validateBeforeSave: false });

  res.status(StatusCodes.OK).json({
    status: "success",
    message: "OTP Vaild",
  });
});

const passwordRest = catchAsync(async (req, res) => {
  const { email, otp, password, passwordConfirm } = req.body;

  const user = await User.findOne({ email, passwordResetOtp: otp });

  if (!user || user.passwordResetExpires < Date.now()) {
    throw new ApiError("OTP Invaild", StatusCodes.NOT_FOUND);
  }
  otpService.clearOtpProperties(user, "password");
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();

  tokenServices.createSendTokenViaCookie(res, StatusCodes.OK, user);
});

module.exports = {
  signup,
  login,
  changeMyPassword,
  verifyEmailOtp,
  requestPasswordReset,
  passwordRest,
  verifyPasswordOtp,
};
