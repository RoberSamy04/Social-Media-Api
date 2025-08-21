const Post = require("../models/postModel");
const Comment = require("../models/commentModel");
const ApiError = require("./ApiError");
const { StatusCodes } = require("http-status-codes");

const incrementCount = async (id) => {
  return Post.findByIdAndUpdate(
    { _id: id },
    {
      $inc: { commentsCount: 1 },
    }
  );
};

const decrementCount = async (id, type) => {
  if (type === "reply") {
    const comment = await Comment.findById(id);

    if (!comment)
      throw new ApiError("comment Not Found", StatusCodes.BAD_REQUEST);

    return Post.findByIdAndUpdate(
      { _id: comment.post._id },
      {
        $inc: { commentsCount: -1 },
      }
    );
  }

  if (type === "comment") {
    return Post.findByIdAndUpdate(
      { _id: id },
      {
        $inc: { commentsCount: -1 },
      }
    );
  }
};

module.exports = { incrementCount, decrementCount };
