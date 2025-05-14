var express = require("express");
var router = express.Router();
var db = require("../models/db.js");
const bcrypt = require("bcrypt");
var path = require("path");
var authCheck = require("../utils/authCheck.js");
const generateAccessToken = require("../utils/generateAccessToken");
const { query, validationResult, check } = require("express-validator");
const User = require("../models/users.model");
const Hashtag = require("../models/hashtag.model");
const Categories = require("../models/categories.model");
const Report = require("../models/report.model");

exports.isAdmin = (req, res) => {
  res.send({success: true, data: authCheck.isAdmin(req,res)});
}

exports.getAdminCenter = (req, res) => {
    if (authCheck.isOwner(req, res)) {
      res.sendFile(path.resolve("../public/admin.html"));
    }
    else {
      res.redirect("/main");
      return false;
    }
};

exports.getHashtags = (req, res) => {
    if (authCheck.isOwner(req, res)) {
        res.sendFile(path.resolve("../public/hashtags.html"));
    }
    else {
        res.redirect("/main");
        return false;
    }
};

exports.getUserPage = (req, res) => {
  if (authCheck.isOwner(req, res)) {
      res.sendFile(path.resolve("../public/users.html"));
  }
  else {
      res.redirect("/main");
      return false;
  }
};

exports.getReportPage = (req, res) => {
  if (authCheck.isOwner(req, res)) {
      res.sendFile(path.resolve("../public/reports.html"));
  }
  else {
      res.redirect("/main");
      return false;
  }
}

exports.getForum = (req, res) => {
  if (authCheck.isOwner(req,res)) res.sendFile(path.resolve("../public/adminForum.html"));
  else {
    res.redirect("/main");
    return false;
  }
}

exports.getUsers = (req, res) => {
  if (authCheck.isOwner(req, res)) {
    User.getAllUsers(req.session.nickname, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `No users found.`,
          });
        } else {
          res.status(500).send({
            message:
              "Error retrieving users",
          });
        }
      } else
        res.send({
          success: true,
          data: data,
        });
    });
  }
  else {
      res.redirect("/main");
      return false;
  }
}

// Create new hashtag
exports.addHashtag = (req,res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  Hashtag.addHashtag(req.session.nickname, req.body.category, req.body.name, (err, data) => {
    if (err) {
      res.status(500).send({
        message: "Error adding hashtag",
      });
    } else {
      res.send({
        success: true,
        data: data,
      });
    }
  });
}

// Delete a hashtag
exports.removeHashtag = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  Hashtag.removeHashtag(req.session.nickname,req.body.tag, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Hashtag not found.`,
        });
      } else {
        res.status(500).send({
          message:
            "Error deleting hashtag",
        });
      }
    } else
      res.send({
        success: true,
        data: data,
      });
  });
}

// Rename hashtag
exports.renameHashtag = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  Hashtag.renameHashtag(req.session.nickname, req.body.tag, req.body.name, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Hashtag not found.`,
        });
      } else {
        res.status(500).send({
          message:
            "Error editing hashtag",
        });
      }
    } else
      res.send({
        success: true,
        data: data,
      });
  });
}
// Create a category
exports.addCategory = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  Categories.addCategory(req.session.nickname, req.body.name, (err, data) => {
    if (err) {
      res.status(500).send({
        message: "Error adding category",
      });
    } else {
      res.send({
        success: true,
        data: data,
      });
    }
  });
}

// Rename a category
exports.renameCategory = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

 Categories.renameCategory(req.session.nickname, req.body.category, req.body.name, (err, data) => {
  if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Category not found.`,
        });
      } else {
        res.status(500).send({
          message:
            "Error editing category",
        });
      }
    } else
      res.send({
        success: true,
        data: data,
      });
  });
}

// Remove a category
exports.removeCategory = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  Categories.removeCategory(req.session.nickname,req.body.category, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Category not found.`,
        });
      } else {
        res.status(500).send({
          message:
            "Error deleting category",
        });
      }
    } else
      res.send({
        success: true,
        data: data,
      });
  });
}




exports.getReports = (req, res) => {
  if (authCheck.isOwner(req, res)) {
    Report.getReports(req.session.nickname, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `No reports found.`,
          });
        } else {
          res.status(500).send({
            message:
              "Error retrieving reports",
          });
        }
      } else
        res.send({
          success: true,
          data: data,
        });
    });
  }
  else {
      res.redirect("/main");
      return false;
  }
}

exports.logReport = (req, res) => {
  if (authCheck.isOwner(req, res)) {
    User.logReport(req.session.nickname, req.body.user_id, (err, data) => {
      if (err) {
          res.status(500).send({
            message:
              "Error logging report",
          });
      } else {
        Report.deleteReport(req.session.nickname, req.body.report_id, (err, data) => {
          if (err) {
              res.status(500).send({
                message:
                  "Error deleting report",
              });
          } else
            res.send({
              success: true,
              data: data,
            });
        });
    }});
  }
  else {
      res.redirect("/main");
      return false;
  }
}

exports.deleteReport = (req, res) => {
  if (authCheck.isOwner(req, res)) {
    Report.deleteReport(req.session.nickname, req.body.report_id, (err, data) => {
      if (err) {
          res.status(500).send({
            message:
              "Error deleting report",
          });
      } else
        res.send({
          success: true,
          data: data,
        });
    });
  }
  else {
      res.redirect("/main");
      return false;
  }
}

exports.removeUser = (req, res) => {
  if (authCheck.isOwner(req, res)) {
    User.removeAccount(req.session.nickname, req.body.user_id, (err, data) => {
      if (err) {
          res.status(500).send({
            message:
              "Error deleting user",
          });
      } else
        res.send({
          success: true,
          data: data,
        });
    });
  }
  else {
      res.redirect("/main");
      return false;
  }
}