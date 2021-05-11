const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  username: { type: String, default: "" },
  post: { type: String, default: "" },
  comments: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      username: { type: String, default: "" },
      comment: { type: String, default: "" },
      createdAt: { type: Date, default: Date.now() },
    },
  ],
  totalLikes: { type: Number, default: 0 },
  likes: [
    {
      username: { type: String, default: "" },
    },
  ],
  created: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("Post", postSchema);
