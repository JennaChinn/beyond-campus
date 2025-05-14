const auth = require("../utils/auth");
const generateAccessToken = require("../utils/generateAccessToken");
const authCheckNext = require("../utils/authCheckNext.js");
const { check } = require("express-validator");

module.exports = (app) => {
  const admin = require("../controllers/admin.js");

  var router = require("express").Router();

  router.get("/verify",admin.isAdmin);

  router.get("/adminCenter", admin.getAdminCenter);

  router.get("/hashtags", admin.getHashtags);

  router.get("/users",admin.getUserPage);

  router.get("/view-reports", admin.getReportPage);

  router.get("/forum",admin.getForum);

  router.get(
    "/users/all",
    authCheckNext.isOwner,
    auth,
    admin.getUsers
  );
  router.delete(
    "/users",
    authCheckNext.isOwner,
    auth,
    admin.removeUser
  );
  // add a tag
  router.post(
    "/hashtags",
    authCheckNext.isOwner,
    auth,
    admin.addHashtag
  );
  // create a category
  router.post(
    "/hashtags/category/new",
    authCheckNext.isOwner,
    auth,
    admin.addCategory
  );
  // rename a category
  router.post(
    "/hashtags/category",
    authCheckNext.isOwner,
    auth,
    admin.renameCategory
  );
  // delete a category
  router.delete(
    "/hashtags/category",
    authCheckNext.isOwner,
    auth,
    admin.removeCategory
  );
  // delete a hashtag
  router.delete(
    "/hashtags/tag",
    authCheckNext.isOwner,
    auth,
    admin.removeHashtag
  );
  // rename a hashtag
  router.post(
    "/hashtags/tag",
    authCheckNext.isOwner,
    auth,
    admin.renameHashtag
  )

  router.get(
    "/report",
    authCheckNext.isOwner,
    auth,
    admin.getReports
  );

  router.post(
    "/report",
    authCheckNext.isOwner,
    auth,
    admin.logReport
  );

  router.delete(
    "/report",
    authCheckNext.isOwner,
    auth,
    admin.deleteReport
  );

  app.use("/admin", router);
};
