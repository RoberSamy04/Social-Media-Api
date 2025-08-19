const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({});

const Like = mongoose.model("Like", likeSchema);

module.exports = Like;
