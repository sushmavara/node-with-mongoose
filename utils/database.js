const mysql = require("mysql2");

const dbConfig = {
  host: "localhost", // host is currently localhost
  user: "root", // this is given by sql server
  password: "1234567su", // root server password
  database: "shop", // db to connect to
  port: 3306,
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
  connectTimeout: 10000,
  acquireTimeout: 10000,
  charset: "utf8mb4",
  timezone: "Z",
  supportBigNumbers: true,
  bigNumberStrings: true,
  multipleStatements: false,
  debug: false,
  insecureAuth: false,
  trace: false,
};

module.exports = mysql
  .createPool(dbConfig, (err, pool) => {
    if (err) {
      console.error("Error creating MySQL pool:", err);
      return;
    }
    console.log("MySQL pool created successfully");
  })
  .promise();
// This code creates a MySQL connection pool using the mysql2 library.
// The pool is configured with various options such as host, user, password, database, and connection limits.
// The pool is exported as a promise, allowing for asynchronous operations.
