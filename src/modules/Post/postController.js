const { StatusCodes } = require("http-status-codes");
const ApiError = require("../../utils/ApiError");
const Post = require("../../models/postModel");
const catchAsync = require("../../utils/catchAsync");
const isAllowedToUpdateOrDelete = require("../../utils/isAllowedToChange");
const ApiFeatures = require("../../utils/apiFeatures");

const createPost = catchAsync(async (req, res) => {
  const post = await Post.create({
    user: req.user.id,
    content: req.body.content,
  });

  res.status(StatusCodes.OK).json({
    status: "success",
    data: {
      post,
    },
  });
});

const getAllPosts = catchAsync(async (req, res) => {
  const features = new ApiFeatures(Post.find(), req.query)
    .filter()
    .limitFields()
    .paginate()
    .sort();

  const posts = await features.query;

  res.status(StatusCodes.OK).json({
    status: "success",
    result: posts.length,
    data: {
      posts,
    },
  });
});

const getPost = catchAsync(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    throw new ApiError("Post Not Found", StatusCodes.NOT_FOUND);
  }
  res.status(StatusCodes.OK).json({
    status: "success",
    data: {
      post,
    },
  });
});

const updatePost = catchAsync(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    throw new ApiError("Post Not Found", StatusCodes.NOT_FOUND);
  }

  isAllowedToUpdateOrDelete(req, post);

  post.isEdited = true;
  post.content = req.body.content;
  await post.save();
  res.status(StatusCodes.OK).json({
    status: "success",
    data: {
      post,
    },
  });
});

const deletePost = catchAsync(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    throw new ApiError("Post Not Found", StatusCodes.NOT_FOUND);
  }

  isAllowedToUpdateOrDelete(req, post);

  await post.deleteOne();
  res.status(StatusCodes.NO_CONTENT).json({
    status: "success",
    data: null,
  });
});

module.exports = { createPost, getAllPosts, getPost, updatePost, deletePost };
