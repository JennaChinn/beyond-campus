const db = require("./db.js");

const Report = function(database) {};

Report.reportUser = (user_id, other_id, message, notes, result) => {
  if (user_id == other_id) {
    result(null, null);
    return;
  }
  db.query(
      "INSERT INTO report (user_reporter,user_reported,message,notes) SELECT ?,user_id,?,? FROM user WHERE user_id=? AND permissions=0;",
      [user_id,message,notes,other_id],
      (err, res) => {
          if (err) {
            result(err, null);
            return;
          } else {
            result(null, null);
            return;
  }});
}

Report.getReports = (user_id, result) => {
    db.query(
      "SELECT permissions FROM user WHERE user_id = ?;",
      [user_id],
      (err, res) => {
        if (err) {
          result(err, null);
          return;
        } else {
          if (!res[0].permissions) {
            err = new Error("Invalid request");
            console.log(err);
            result(err, null);
            return;
          }
          db.query(
            "SELECT user_reported, message, notes, report_id, reports FROM report, user WHERE user_id=user_reported;",
            (err, res) => {
              if (err) {
                result(err, null);
                return;
              }
              result(null, res);
              return;
          });
      }
    });
}

Report.deleteReport = (user_id, report_id, result) => {
    db.query(
      "SELECT permissions FROM user WHERE user_id = ?;",
      [user_id],
      (err, res) => {
        if (err) {
          result(err, null);
          return;
        } else {
          if (!res[0].permissions) {
            err = new Error("Invalid request");
            console.log(err);
            result(err, null);
            return;
          }
          db.query(
            "DELETE FROM report WHERE report_id=?;",
            [report_id],
            (err, res) => {
              if (err) {
                result(err, null);
                return;
              }
              result(null, res);
              return;
          });
      }
    });
}

module.exports = Report;