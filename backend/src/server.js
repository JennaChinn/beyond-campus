const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const FileStore = require("session-file-store")(session);
const https = require("https");
const fs = require("fs");
const db = require("./models/db.js");
require("dotenv").config();

var auth = require("./utils/auth.js");
var authCheck = require("./utils/authCheck.js");

const app = express();
const port = 443;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(
  session({
    secret: process.env.TOKEN_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new FileStore(),
  })
);
app.use("/css", express.static(path.resolve("../public/styles")));
app.use("/scripts", express.static(path.resolve("../public/scripts")));

// api routes
require("./routes/routes.js")(app);
// routes for user authorization
require("./routes/authRouter.js")(app);
// routes for admin
require("./routes/adminRouter.js")(app);
// routes for messages
require("./routes/messageRouter.js")(app);


//in general this is not the correct way to do this but for now this
//will solve the issue
app.get("/favicon.ico", (req, res) => {
  res.sendFile(path.resolve("favicon.ico"))
});

app.get("/", (req, res) => {
  // if not logged in, redirect to the login page

  if (!authCheck.isOwner(req, res)) {
    res.redirect("/auth/login");
    return false;
  }

  // if logged in, redirect to the main page
  else {
    res.redirect("/main");
    return false;
  }
});

// main page

app.get("/main", (req, res) => {
  // if not logged in, redirect to the login page

  if (!authCheck.isOwner(req, res)) {
    res.redirect("/auth/login");
    return false;
  }
  if (authCheck.isAdmin(req,res)) res.sendFile(path.resolve("../public/admin.html"));
  // If the user is authenticated, it generates an HTML response.?
  else res.sendFile(path.resolve("../public/main.html"));
});

app.get("/question", (req, res) => {
  // if not logged in, redirect to the login page

  if (!authCheck.isOwner(req, res)) {
    res.redirect("/auth/login");
    return false;
  }

  // If the user is authenticated, it generates an HTML response.?
  res.sendFile(path.resolve("../public/question.html"));
});

app.get("/friends-hashtag", (req, res) => {
  // if not logged in, redirect to the login page

  if (!authCheck.isOwner(req, res)) {
    res.redirect("/auth/login");
    return false;
  }

  // If the user is authenticated, it generates an HTML response.?
  res.sendFile(path.resolve("../public/friends-hashtag.html"));
});

app.get("/friends", (req, res) => {
  // if not logged in, redirect to the login page

  if (!authCheck.isOwner(req, res)) {
    res.redirect("/auth/login");
    return false;
  }

  // If the user is authenticated, it generates an HTML response.?
  res.sendFile(path.resolve("../public/friends.html"));
});

app.get("/profile", (req, res) => {
  // if not logged in, redirect to the login page

  if (!authCheck.isOwner(req, res)) {
    res.redirect("/auth/login");
    return false;
  }

  // If the user is authenticated, it generates an HTML response.?
  res.sendFile(path.resolve("../public/profile.html"));
});

https
  .createServer(
    {
      key: fs.readFileSync("key.pem"),
      cert: fs.readFileSync("cert.pem"),
      passphrase: "krkr13",
    },
    app
  )
  .listen(port, () => {
    console.log(`app listening at https://localhost:${port}`);
  });

db.query(
  "INSERT IGNORE INTO user (user_id, username, password, email, major, year, gender, registration_date, permissions) VALUES(1,?,?,?,?,?,?,?,?)",
  ["ADMIN", process.env.ADMIN_PASSWORD, process.env.ADMIN_USERNAME, 'null', 2025, 'Other', '2025-01-01', 1],
  function (error, data) {
    if (error) throw error;
  }
);