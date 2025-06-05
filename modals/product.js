const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  imageUrl: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User", // Reference to User model
    required: true,
  },
});

module.exports = mongoose.model("Product", productSchema);
