const HttpStatus = require("http-status-codes");
const People = require("../models/userModels");

module.exports = {
  async GetAllPeople(req, res) {
    await People.find({})
      .populate("posts.postId")
      .populate("following.userFollowed")
      .populate("followers.follower")
      .then((result) => {
        res.status(HttpStatus.OK).json({ message: "All users", result });
      })
      .catch((error) => {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: "An error occured" });
      });
  },
  async GetUserById(req, res) {
    await People.findOne({ _id: req.params.id })
    .populate("posts.postId")
    .populate("following.userFollowed")
    .populate("followers.follower")
      .then((result) => {
        res.status(HttpStatus.OK).json({ message: "User by Id", result });
      })
      .catch((error) => {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: "An error occured" });
      });
  },
  async GetUserByUsername(req, res) {
    await People.findOne({ username: req.params.username })
    .populate("posts.postId")
    .populate("following.userFollowed")
    .populate("followers.follower")
      .then((result) => {
        res.status(HttpStatus.OK).json({ message: "User by Username", result });
      })
      .catch((error) => {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: "An error occured" });
      });
  },
};
