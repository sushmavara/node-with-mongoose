const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const Order = sequelize.define("order", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  number: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4, // auto-generates UUID
    allowNull: false,
  },
});

module.exports = Order;
