const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        }, // Reference to Product model
        qty: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (productId) {
  // Here this refers to the instance of the User model
  let updatedCartItems = [...this.cart.items];
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.productId.toString() === productId.toString();
  });
  if (cartProductIndex !== -1) {
    // If product already exists in the cart, increment the quantity
    const currentQty = this.cart.items[cartProductIndex].qty;
    updatedCartItems[cartProductIndex].qty = currentQty + 1;
  } else {
    updatedCartItems.push({ productId, qty: 1 });
  }
  // Update the cart property of the User instance
  this.cart = {
    items: updatedCartItems,
  };

  return this.save();
};

userSchema.methods.deleteItemFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter(
    (cp) => cp.productId.toString() !== productId.toString()
  );
  this.cart = {
    items: updatedCartItems,
  };
  return this.save();
};

userSchema.methods.deleteItemByQty = function (productId, qtyToDelete = 1) {
  const cartItem = this.cart.items.find(
    (item) => item.productId.toString() === productId.toString()
  );
  if (!cartItem) {
    return Promise.reject(new Error("Item not found in cart"));
  }

  // removing entire product row if last qty
  if (Number(cartItem.qty) - Number(qtyToDelete) <= 0) {
    return this.deleteItemFromCart(productId);
  }

  const updatedCartItems = this.cart.items.map((item) => {
    if (item.productId.toString() === productId.toString()) {
      item.qty = item.qty - qtyToDelete; // decrementing the quantity keeping object reference intack
      return item;
    } else {
      return item;
    }
  });
  // Updating qty
  this.cart = {
    items: updatedCartItems,
  };

  return this.save();
};

userSchema.methods.resetCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
