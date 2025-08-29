const { StatusCodes } = require("http-status-codes");
const ApiError = require("../../utils/ApiError");
const catchAsync = require("../../utils/catchAsync");
const Like = require("../../models/likeModel");
const Post = require("../../models/postModel");
const Comment = require("../../models/commentModel");
const Reply = require("../../models/replyModel");

const likeFactory = async (Model, ModelId, ModelField, userId, res) => {
  const doc = await Model.findById(ModelId);

  if (!doc) {
    throw new ApiError(`${ModelField} Not Found`, StatusCodes.BAD_REQUEST);
  }

  try {
    await Like.create({
      user: userId,
      [ModelField]: ModelId,
    });

    await doc.updateOne({
      $inc: { likesCount: 1 },
    });

    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Done",
    });
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(error, StatusCodes.BAD_REQUEST);
    }
    throw error;
  }
};

const unlikeFactory = async (Model, ModelId, ModelField, userId, res) => {
  const doc = await Model.findById(ModelId);

  if (!doc) {
    throw new ApiError(`${ModelField} Not Found`, StatusCodes.BAD_REQUEST);
  }
  const like = await Like.findOne({
    user: userId,
    [ModelField]: ModelId,
  });

  if (!like) {
    throw new ApiError(
      `you should like the ${ModelField} first to unlike it`,
      StatusCodes.BAD_REQUEST
    );
  }

  await like.deleteOne();

  await doc.updateOne({
    $inc: { likesCount: -1 },
  });

  res.status(StatusCodes.OK).json({
    status: "success",
    message: "Done",
  });
};

const likePost = catchAsync(async (req, res) => {
  await likeFactory(Post, req.params.postId, "post", req.user._id, res);
});

const likeComment = catchAsync(async (req, res) => {
  await likeFactory(
    Comment,
    req.params.commentId,
    "comment",
    req.user._id,
    res
  );
});

const likeReply = catchAsync(async (req, res) => {
  await likeFactory(Reply, req.params.replyId, "reply", req.user._id, res);
});

const unLikePost = catchAsync(async (req, res) => {
  await unlikeFactory(Post, req.params.postId, "post", req.user._id, res);
});

const unLikeComment = catchAsync(async (req, res) => {
  await unlikeFactory(
    Comment,
    req.params.commentId,
    "comment",
    req.user._id,
    res
  );
});

const unLikeReply = catchAsync(async (req, res) => {
  await unlikeFactory(
    Reply,
    req.params.replyId,
    "reply",
    req.user._id,
    res,
    req
  );
});

module.exports = {
  likePost,
  likeComment,
  likeReply,
  unLikePost,
  unLikeComment,
  unLikeReply,
};
