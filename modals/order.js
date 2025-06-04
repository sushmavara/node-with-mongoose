const { v4: uuid } = require("uuid");
const { getDb } = require("../utils/database");
const { COLLECTION_NAME } = require("../constants/db");
const { ObjectId } = require("mongodb");

class Order {
  constructor(items, userId, orderNumber = uuid(), createdAt = new Date()) {
    this.items = items; // Array of product objects
    this.userId = userId; // User ID who placed the order
    this.number = orderNumber;
    this.createdAt = createdAt;
  }

  save() {
    const db = getDb();
    return db.collection(COLLECTION_NAME.ORDERS).insertOne({
      userId: this.userId,
      items: this.items,
      number: this.number,
      createdAt: this.createdAt,
    });
  }

  static getAllOrders(userId) {
    const db = getDb();
    return db
      .collection(COLLECTION_NAME.ORDERS)
      .find({
        userId: new ObjectId(userId),
      })
      .toArray();
  }
}

module.exports = Order;
