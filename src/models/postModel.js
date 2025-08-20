const mongoose = require("mongoose");
const validator = require("validator");
const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "the post must have a user"],
  },

  content: {
    type: String,
    required: [true, "Please provide a content for the post"],
    validate: {
      validator: (str) => validator.isAlpha(str, "en-US", { ignore: " " }),
      message: "Please provide a valid content",
    },
  },

  likesCount: {
    type: Number,
    default: 0,
  },
  // comments Count
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  isEdited: {
    type: Boolean,
    default: false,
  },
});

//populate the user's data
postSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "-__v -passwordChangedAt -isEmailVerified",
  });

  next();
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
