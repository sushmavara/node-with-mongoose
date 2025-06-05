const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  number: {
    type: Schema.Types.UUID,
    default: () => new mongoose.Types.UUID(),
    required: true,
  },
  user: {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
  },
  items: [
    {
      title: String,
      imageUrl: String,
      description: String,
      price: {
        type: Number,
        required: true,
      },
      qty: {
        type: Number,
        required: true,
      },
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  totalPrice: {
    type: Number,
    default: 0.0,
  },
});

module.exports = mongoose.model("Order", orderSchema);
// This code defines a Mongoose schema for an Order model, which includes fields for order number, user details, items in the order, creation date, and total price. The schema is then exported as a Mongoose model named "Order".
