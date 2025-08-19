const otpGenerator = require("otp-generator");

const clearOtpProperties = (user, type) => {
  if (type === "email") {
    user.emailVerificationOtp = undefined;
    user.emailVerificationExpires = undefined;
  }
  if (type === "password") {
    user.passwordResetOtp = undefined;
    user.passwordResetExpires = undefined;
  }
};

const createOtpObject = async (user, type) => {
  const otpObj = {
    otpString: otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    }),
    expires: new Date(Date.now() + process.env.OTP_EXPIRES * 60 * 1000),
  };

  if (type === "email") {
    user.emailVerificationOtp = otpObj.otpString;
    user.emailVerificationExpires = otpObj.expires;
  }

  if (type === "password") {
    user.passwordResetOtp = otpObj.otpString;
    user.passwordResetExpires = otpObj.expires;
  }
  await user.save({ validateBeforeSave: false });

  return otpObj;
};

module.exports = { clearOtpProperties, createOtpObject };
