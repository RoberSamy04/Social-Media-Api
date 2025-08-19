const mongoose = require("mongoose");
const validator = require("validator");
const commentSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.ObjectId,
    ref: "Post",
    required: [true, "The comment must have a post"],
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "The comment must have a user"],
  },

  content: {
    type: String,
    required: [true, "Please provide a content for the comment"],
    validate: {
      validator: (str) => validator.isAlpha(str, "en-US", { ignore: " " }),
      message: "Please provide a valid content",
    },
  },

  likesCount: {
    type: Number,
    default: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },

  isEdited: {
    type: Boolean,
    default: false,
  },
});

commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "-__v -passwordChangedAt -isEmailVerified",
  });

  next();
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
