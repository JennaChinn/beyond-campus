const mysql = require("mysql2");
const dbConfig = require("../config");

// Create a connection to the database
const connection = mysql.createConnection({
  // host: dbConfig.HOST,
  //host: localhost,
  host: process.env.MYSQL_HOST_IP,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  //socketPath: '/var/run/mysqld/mysqld.sock',
  port: 3306
});

// open the MySQL connection
connection.connect((error) => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

module.exports = connection;