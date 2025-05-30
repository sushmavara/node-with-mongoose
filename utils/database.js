const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("shop", "root", "1234567su", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
