const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "the post must have a user"],
  },

  post: {
    type: mongoose.Schema.ObjectId,
    ref: "Post",
  },

  comment: {
    type: mongoose.Schema.ObjectId,
    ref: "Comment",
  },

  reply: {
    type: mongoose.Schema.ObjectId,
    ref: "Reply",
  },
});

likeSchema.index(
  { user: 1, post: 1 },
  { unique: true, partialFilterExpression: { post: { $exists: true } } }
);

likeSchema.index(
  { user: 1, comment: 1 },
  { unique: true, partialFilterExpression: { comment: { $exists: true } } }
);

likeSchema.index(
  { user: 1, reply: 1 },
  { unique: true, partialFilterExpression: { reply: { $exists: true } } }
);

const Like = mongoose.model("Like", likeSchema);

module.exports = Like;
