const { validationResult } = require("express-validator");
const dotenv = require("dotenv");
const User = require("../models/users.model");
const UserHashtag = require("../models/userhashtag.model");
const Friends = require("../models/friends.model");
const Hashtag = require("../models/hashtag.model");
const Categories = require("../models/categories.model");
const Block = require("../models/block.model");
const Report = require("../models/report.model");

dotenv.config();

/*
 *
 * USER FUNCTIONS
 * 
*/

// Find current user
exports.findCurrentUser = (req, res) => {
  User.findById(req.session.nickname, req.session.nickname, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found user with id ${req.session.nickname}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving user with id " + req.session.nickname,
        });
      }
    } else
      res.send({
        success: true,
        user_id: data.user_id,
        username: data.username,
        major: data.major,
        year: data.year,
        gender: data.gender,
        bio: data.bio,
        registration_date: data.registration_date,
        perm: data.permissions
      });
  });
};

// Find a user
exports.findUser = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  if (req.query.user_id == req.session.nickname) {
    res.send({success: false});
    return;
  }

  User.findById(req.query.user_id, req.session.nickname, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found user with id ${req.query.user_id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving user with id " + req.query.user_id,
        });
      }
    } else if (!data) {
      res.send({success: false});
    } else if (data.permissions == 1) {
      res.send({success: false});
    } else
      res.send({
        success: true,
        user_id: data.user_id,
        username: data.username,
        major: data.major,
        year: data.year,
        gender: data.gender,
        bio: data.bio,
        registration_date: data.registration_date,
        permissions: data.permissions
      });
  });
};

// Update user bio
exports.updateBio = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  if (!req.session.nickname) {
    return res.status(400).json({ success: false, message: "no user" });
  }
  User.updateBio(req.session.nickname, req.body.bio, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found user with id ${req.session.nickname}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating bio of user " + req.session.nickname,
        });
      }
    } else
      res.send({
        success: true,
        bio: req.body.bio,
      });
  });
};

/*
 *
 * HASHTAG FUNCTIONS
 * 
*/

// Get all hashtags
exports.getHashtags = (req, res) => {
  Hashtag.getHashtags((err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `No hashtags found.`,
        });
      } else {
        res.status(500).send({
          message:
            "Error retrieving hashtags",
        });
      }
    } else
      res.send({
        success: true,
        data: data,
      });
  });
}

/*
 *
 * CATEGORY FUNCTIONS
 * 
 */

// Get categories
exports.getCategories = (req,res) => {
  Categories.getCategories((err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `No hashtags found.`,
        });
      } else {
        res.status(500).send({
          message:
            "Error retrieving hashtags",
        });
      }
    } else
      res.send({
        success: true,
        data: data,
      });
  });
}


/*
 *
 * USER HASHTAG FUNCTIONS
 * 
 */

exports.getUserHashtags = (req, res) => {
  if (!req.session.nickname) {
    return res.status(400).json({ success: false, message: "no user" });
  }
  UserHashtag.getUserHashtags(req.session.nickname, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found hashtag with user id ${req.session.nickname}.`,
        });
      } else {
        res.status(500).send({
          message:
            "Error retrieving hashtag with user id " + req.session.nickname,
        });
      }
    } else
      res.send({
        success: true,
        data: data,
      });
  });
};

// Get other user's hashtags
exports.getOtherUserHashtags = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  UserHashtag.getUserHashtags(req.query.user_id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found hashtag with user id ${req.query.user_id}.`,
        });
      } else {
        res.status(500).send({
          message:
            "Error retrieving hashtag with user id " + req.query.user_id,
        });
      }
    } else
      res.send({
        success: true,
        data: data,
      });
  });
};

// Update user hashtags
exports.updateUserHashtag = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  if (!req.session.nickname) {
    return res.status(400).json({ success: false, message: "no user" });
  }

  const selectedTags = req.body.selectedValues;

  const deleteHashtags = (selectedTag) => {
    return new Promise((resolve, reject) => {
      UserHashtag.deleteHashtag(req.session.nickname, selectedTag, (err, data) => {
        if (err && err.kind !== "not_found") {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  };

  const insertHashtags = (selectedTag) => {
    return new Promise((resolve, reject) => {
      UserHashtag.insertHashtag(req.session.nickname, selectedTag, (err, data) => {
        if (err && err.kind !== "not_found") {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  };

  try {
    for (const selectedTag of selectedTags) {
      await deleteHashtags(selectedTag);
    }
    for (const selectedTag of selectedTags) {
      await insertHashtags(selectedTag);
    }
    res.send({ success: true });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};

// Get potential friends
exports.getPotentialFriends = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (!req.session.nickname) {
    return res.status(400).json({ success: false, message: "no user" });
  }

  const tagsParam = req.query.tags;
  if (!tagsParam) {
    return res.status(400).json({ error: "Tags parameter missing" });
  }

  const tags = tagsParam.split(",");

  UserHashtag.getPotentialFriends(req.session.nickname, tags, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({
          message: `Not found hashtag with user id ${req.session.nickname}.`,
        });
      } else {
        return res.status(500).json({
          message:
            "Error retrieving hashtag with user id " + req.session.nickname,
        });
      }
    } else {
      let userCommonTagCounts = {};

      const userHashtags = data;

      tags.forEach((tag) => {
        userHashtags.forEach((userHashtag) => {
          if (userHashtag.tag_number === tag) {
            const userID = userHashtag.user_id;

            if (!userCommonTagCounts[userID]) {
              userCommonTagCounts[userID] = {
                user_id: userID,
                common: 1,
                tags: [tag],
              };
            } else {
              userCommonTagCounts[userID].common += 1;
              userCommonTagCounts[userID].tags.push(tag);
            }
          }
        });
      });

      const resultArray = Object.values(userCommonTagCounts);

      res.json({ success: true, data: resultArray });
    }
  });
};

/*
 *
 * FRIEND FUNCTIONS
 * 
 */

exports.requestFriend = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (!req.session.nickname) {
    return res.status(400).json({ success: false, message: "no user" });
  }
  Friends.requestFriend(
    req.session.nickname,
    req.body.friend_user_id,
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found user with id ${req.session.nickname}.`,
          });
        } else {
          res.status(500).send({
            message: "Error requesting friend of user " + req.session.nickname,
          });
        }
      } else
        res.send({
          success: true,
          friend_user_id: req.body.friend_user_id,
        });      
    }
  )
}

// Insert friend (direct add)
exports.insertFriend = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (!req.session.nickname) {
    return res.status(400).json({ success: false, message: "no user" });
  }
  Friends.insertFriend(req.session.nickname, req.body.friend_user_id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found user with id ${req.session.nickname}.`,
        });
      } else {
        res.status(500).send({
          message: "Error inserting friend of user " + req.session.nickname,
        });
      }
    } else
      res.send({
        success: true,
        friend_user_id: req.body.friend_user_id,
      });
  });
};

exports.rejectRequest = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (!req.session.nickname) {
    return res.status(400).json({ success: false, message: "no user" });
  }
  Friends.rejectRequest(
    req.session.nickname,
    req.body.request_id,
    (err, data) => {
      if (err) {
        if (err.kind == "not_found") {
          res.status(404).send({
            message: `Not found user with id ${req.session.nickname}.`,
          });
        } else {
          res.status(500).send({
            message: `Error rejecting request of user ${req.session.nickname}`,
          });
        }
    } else
      res.send({
        success: true,
        request_id: req.body.req_id,
      });
    }
  );
};

// Delete friend
exports.deleteFriend = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (!req.session.nickname) {
    return res.status(400).json({ success: false, message: "no user" });
  }
  Friends.deleteFriend(req.session.nickname, req.body.friend_user_id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found user with id ${req.session.nickname}.`,
        });
      } else {
        res.status(500).send({
          message: "Error deleting friend of user " + req.session.nickname,
        });
      }
    } else
      res.send({
        success: true,
        friend_user_id: req.body.friend_user_id,
      });
  });
};

// Get current user's friends
exports.getCurrentUserFriends = (req, res) => {
  Friends.getUserFriends(req.session.nickname, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found friends with user id ${req.session.nickname}.`,
        });
      } else {
        res.status(500).send({
          message:
            "Error retrieving friends of user id " + req.session.nickname,
        });
      }
    } else {
      res.send({ success: true, data: data });
    }
  });
};

exports.getCurrentUserRequests = (req, res) => {
  Friends.getUserRequests(req.session.nickname, (err, data) => {
    if (err) {
      if (err.kind == "not_found") {
        return res.send({
          success: true,
          data: [],
        });
      } else {
        res.status(500).send({
          message: `Error retrieving requests of user id ${req.session.nickname}.`,
        });
      }
    } else
      res.send({
        success:true,
        data:data,
      });
  });
};

/*
 *
 * BLOCK FUNCTIONS
 * 
 */

exports.blockUser = (req, res) => {
  Block.blockUser(req.session.nickname, req.body.block_id, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found user with id ${req.session.nickname}.`,
          });
        } else {
          res.status(500).send({
            message: "Error blocking user",
          });
        }
      } else
        res.send({
          success: true,
          data: data
        });      
  });
}

exports.unblockUser = (req, res) => {
  Block.unblockUser(req.session.nickname, req.body.block_id, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found user with id ${req.session.nickname}.`,
          });
        } else {
          res.status(500).send({
            message: "Error unblocking user",
          });
        }
      } else
        res.send({
          success: true,
          data: data
        });      
  });
}

exports.getBlocks = (req, res) => {
  Block.getBlocks(req.session.nickname, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found user with id ${req.session.nickname}.`,
        });
      } else {
        res.status(500).send({
          message: "Error fetching blocks",
        });
      }
    } else
      res.send({
        success: true,
        data: data
      });  
  });
}

exports.getBlocked = (req, res) => {
  Block.getBlocked(req.session.nickname, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found user with id ${req.session.nickname}.`,
        });
      } else {
        res.status(500).send({
          message: "Error fetching blocks",
        });
      }
    } else
      res.send({
        success: true,
        data: data
      });  
  });
}

/*
 *
 * REPORT FUNCTIONS
 * 
 */

exports.reportUser = (req, res) => {
  Report.reportUser(req.session.nickname, req.body.report_id, req.body.message, req.body.notes, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found user with id ${req.session.nickname}.`
        });
      } else {
        res.status(500).send({
          message: "Error reporting user",
        });
      }
    } else res.send({
      success: true,
      data: data
    });
  });
}