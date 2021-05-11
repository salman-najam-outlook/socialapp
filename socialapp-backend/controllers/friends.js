const HttpStatus = require("http-status-codes");
const People = require("../models/userModels");

module.exports = {
  FollowUser(req, res) {
    const followUser = async () => {
      await People.updateOne(
        {
          _id: req.user._id,
          "following.userFollowed": { $ne: req.body.userFollowed },
        },
        {
          $push: {
            following: {
              userFollowed: req.body.userFollowed,
            },
          },
        }
      );

      await People.updateOne(
        {
          _id: req.body.userFollowed,
          "following.follower": { $ne: req.user._id },
        },
        {
          $push: {
            followers: {
              follower: req.user._id,
            },
            notifications: {
              senderId: req.user._id,
              message: `${req.user.username} is now following you`,
              created: new Date(),
              viewProfile: false,
            },
          },
        }
      );
    };

    followUser()
      .then(() => {
        res.status(HttpStatus.OK).json({ message: "Following user now" });
      })
      .catch(() => {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: "Error occured" });
      });
  },

  UnFollowUser(req, res) {
    const unFollowUser = async () => {
      await People.updateOne(
        {
          _id: req.user._id,
        },
        {
          $pull: {
            following: {
              userFollowed: req.body.userFollowed,
            },
          },
        }
      );

      await People.updateOne(
        {
          _id: req.body.userFollowed,
        },
        {
          $pull: {
            followers: {
              follower: req.user._id,
            },
          },
        }
      );
    };

    unFollowUser()
      .then(() => {
        res.status(HttpStatus.OK).json({ message: "Unfollowing user now" });
      })
      .catch(() => {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: "Error occured" });
      });
  },

  async MarkNotification(req, res) {
    if (!req.body.deleteValue) {
      await People.updateOne(
        {
          _id: req.user._id,
          "notifications._id": req.body.id,
        },
        {
          $set: { "notifications.$.read": true },
        }
      )
        .then(() => {
          res.status(HttpStatus.OK).json({ message: "Marked as read" });
        })
        .catch((err) => {
          res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: "Error occured" });
        });
    } else {
      await People.updateOne(
        {
          _id: req.user._id,
          "notifications._id": req.body.id,
        },
        {
          $pull: {
            notifications: { _id: req.params.id },
          },
        }
      )
        .then(() => {
          res.status(HttpStatus.OK).json({ message: "Deleted successfully" });
        })
        .catch((err) => {
          res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: "Error occured" });
        });
    }
  },
  async MarkAllNotifications(req, res) {
    await People.update(
      {
        _id: req.user._id,
      },
      {
        $set: {
          "notifications.$[elem].read": true,
        },
      },
      {
        arrayFilters: [{ "elem.read": false }],
        multi: true,
      }
    )
    .then(() => {
      res.status(HttpStatus.OK).json({ message: "Marked all successfully" });
    })
    .catch((err) => {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Error occured" });
    });
  },
};
