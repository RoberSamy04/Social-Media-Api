const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const ApiError = require("../utils/ApiError");
const { StatusCodes } = require("http-status-codes");
const otpService = require("../utils/otpService");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    trim: true,
  },

  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, "Please enter a vaild Email"],
  },

  password: {
    type: String,
    required: [true, "Please enter your password"],
    trim: true,
    select: false,
    minlength: [8, "password must be atleast 8 characters long"],
  },

  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    trim: true,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same",
    },
  },

  photo: {
    type: String,
    //default : ""
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  isEmailVerified: {
    type: Boolean,
    default: false,
  },

  emailVerificationOtp: String,
  emailVerificationExpires: Date,

  passwordResetOtp: String,
  passwordResetExpires: Date,

  passwordChangedAt: Date,
});

//hash the password BEFORE SAVING IT
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

//compare the two passwords
userSchema.methods.comparePasswords = async (userPassword, dbPassword) =>
  await bcrypt.compare(userPassword, dbPassword);

// set the passwordChangedAt property if the user changed his password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) {
    return next();
  }
  this.passwordChangedAt = Date.now() - 2000; // delay is so we can set the property before saving it
  next();
});

//check if the user changed his password after he logged in
userSchema.methods.changedPasswordAfter = function (jwtTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    ); // convert the passwordChangedAt to seconds
    return changedTimestamp > jwtTimeStamp;
  }

  //means the password didnt change
  return false;
};

userSchema.methods.verifyOtp = async function (otp, type) {
  if (type === "email") {
    if (
      this.emailVerificationOtp !== otp ||
      this.emailVerificationExpires < new Date() ||
      !this.emailVerificationOtp
    ) {
      throw new ApiError("Invaild or expired otp", StatusCodes.BAD_REQUEST);
    }
    this.isEmailVerified = true;
    otpService.clearOtpProperties(this, "email");
  }

  if (type === "password") {
    if (
      this.passwordResetOtp !== otp ||
      this.passwordResetExpires < new Date() ||
      !this.passwordResetOtp
    ) {
      throw new ApiError("Invaild or expired otp", StatusCodes.BAD_REQUEST);
    }
  }

  //await this.save({ validateBeforeSave: false });
  return true;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
