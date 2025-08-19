const { StatusCodes } = require("http-status-codes");
const ApiError = require("../../utils/ApiError");
const Comment = require("../../models/commentModel");
const catchAsync = require("../../utils/catchAsync");
const isAllowedToUpdateOrDelete = require("../../utils/isAllowedToChange");

const createComment = catchAsync(async (req, res) => {
  const comment = await Comment.create({
    user: req.user.id,
    post: req.params.postId,
    content: req.body.content,
  });

  res.status(StatusCodes.CREATED).json({
    status: "success",
    data: {
      comment,
    },
  });
});

const getAllComments = catchAsync(async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId });

  res.status(StatusCodes.OK).json({
    status: "success",
    result: comments.length,
    data: {
      comments,
    },
  });
});

const updateComment = catchAsync(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);

  if (!comment) {
    throw new ApiError("Comment Not Found", StatusCodes.NOT_FOUND);
  }

  isAllowedToUpdateOrDelete(req, comment);

  comment.content = req.body.content;
  comment.isEdited = true;

  await comment.save();

  res.status(StatusCodes.OK).json({
    status: "success",
    data: {
      comment,
    },
  });
});

const deleteComment = catchAsync(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);

  if (!comment) {
    throw new ApiError("Comment Not Found", StatusCodes.NOT_FOUND);
  }
  isAllowedToUpdateOrDelete(req, comment);

  await comment.deleteOne();

  res.status(StatusCodes.NO_CONTENT).json({
    status: "success",
    data: null,
  });
});

module.exports = {
  createComment,
  getAllComments,
  updateComment,
  deleteComment,
};
