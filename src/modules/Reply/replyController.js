const { StatusCodes } = require("http-status-codes");
const ApiError = require("../../utils/ApiError");
const Reply = require("../../models/replyModel");
const catchAsync = require("../../utils/catchAsync");
const isAllowedToUpdateOrDelete = require("../../utils/isAllowedToChange");

const createReply = catchAsync(async (req, res) => {
  const reply = await Reply.create({
    user: req.user.id,
    comment: req.params.commentId,
    content: req.body.content,
  });

  res.status(StatusCodes.CREATED).json({
    status: "success",
    data: {
      reply,
    },
  });
});

const getAllReplies = catchAsync(async (req, res) => {
  const replies = await Reply.find({ comment: req.params.commentId });

  res.status(StatusCodes.OK).json({
    status: "success",
    result: replies.length,
    data: {
      replies,
    },
  });
});

const updateReply = catchAsync(async (req, res) => {
  const reply = await Reply.findById(req.params.replyId);

  if (!reply) {
    throw new ApiError("Reply Not Found", StatusCodes.NOT_FOUND);
  }

  isAllowedToUpdateOrDelete(req, reply);

  reply.content = req.body.content;
  reply.isEdited = true;

  await reply.save();

  res.status(StatusCodes.OK).json({
    status: "success",
    data: {
      reply,
    },
  });
});

const deleteReply = catchAsync(async (req, res) => {
  const reply = await Reply.findById(req.params.replyId);

  if (!reply) {
    throw new ApiError("Reply Not Found", StatusCodes.NOT_FOUND);
  }
  isAllowedToUpdateOrDelete(req, reply);

  await reply.deleteOne();

  res.status(StatusCodes.NO_CONTENT).json({
    status: "success",
    data: null,
  });
});

module.exports = { createReply, getAllReplies, updateReply, deleteReply };
