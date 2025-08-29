const { StatusCodes } = require("http-status-codes");
const ApiError = require("./ApiError");

const isAllowedToUpdateOrDelete = (userId, doc) => {
  if (doc.user._id.toString() !== userId) {
    throw new ApiError(
      "you are not allowed to (edit/delete) other user's (posts/ replies/comments)",
      StatusCodes.FORBIDDEN
    );
  }
  return true;
};

module.exports = isAllowedToUpdateOrDelete;
