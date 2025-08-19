const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "The reply must have a user"],
  },

  comment: {
    type: mongoose.Schema.ObjectId,
    ref: "Comment",
    required: [true, "The reply must have a comment"],
  },

  content: {
    type: String,
    required: [true, "Please provide a content for the reply"],
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

replySchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "-__v -passwordChangedAt -isEmailVerified",
  });

  next();
});

const Reply = mongoose.model("Reply", replySchema);
module.exports = Reply;
