const sequelize = require("../utils/database");
const { DataTypes } = require("sequelize");

const CartItem = sequelize.define("cartItem", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  qty: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = CartItem;
