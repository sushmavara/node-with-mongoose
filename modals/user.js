const { ObjectId } = require("mongodb");

const { getDb } = require("../utils/database");
const { COLLECTION_NAME } = require("../constants/db");

class User {
  constructor(name, email, phone, cart = { items: [] }, id) {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.cart = cart; // {items}
    this._id = id ? new ObjectId(id) : null; // Convert id to ObjectId if provided
  }

  save() {
    const db = getDb();
    return db.collection(COLLECTION_NAME.USERS).insertOne(this);
  }

  addToCart(productId) {
    const db = getDb();
    let updatedCartItems = [...this.cart.items];

    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() === productId.toString();
    });

    if (cartProductIndex !== -1) {
      // If product already exists in the cart, increment the quantity
      const currentQty = this.cart.items[cartProductIndex].qty;
      updatedCartItems[cartProductIndex].qty = currentQty + 1;
    } else {
      updatedCartItems.push({ productId: new ObjectId(productId), qty: 1 });
    }
    return db.collection(COLLECTION_NAME.USERS).updateOne(
      { _id: new ObjectId(this._id) },
      {
        $set: {
          cart: {
            items: updatedCartItems,
          },
        },
      }
    );
  }

  deleteItemByQty(productId, qtyToDelete) {
    const db = getDb();
    const cartItem = this.cart.items.find(
      (item) => item.productId.toString() === productId.toString()
    );
    if (!cartItem) {
      return Promise.reject(new Error("Item not found in cart"));
    }

    // removing entire product row
    if (Number(cartItem.qty) - Number(qtyToDelete) <= 0) {
      return this.deleteItemFromCart(productId);
    }

    return db.collection(COLLECTION_NAME.USERS).updateOne(
      { _id: new ObjectId(this._id) },
      {
        $set: {
          cart: {
            items: this.cart.items.map((item) => {
              if (item.productId.toString() === productId.toString()) {
                return { ...item, qty: item.qty - qtyToDelete };
              } else {
                return item;
              }
            }),
          },
        },
      }
    );
  }

  deleteItemFromCart(productId) {
    const db = getDb();
    return db.collection(COLLECTION_NAME.USERS).updateOne(
      { _id: new ObjectId(this._id) },
      {
        $set: {
          cart: {
            items: this.cart.items.filter(
              (item) => item.productId.toString() !== productId.toString()
            ),
          },
        },
      }
    );
  }

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map(
      (item) => new ObjectId(item.productId)
    );
    return db
      .collection("products")
      .find({
        _id: { $in: productIds },
      })
      .toArray()
      .then((products) => {
        const updatedCartItems = this.cart.items.map((item) => {
          const product = products.find(
            (p) => p._id.toString() === item.productId.toString()
          );
          return {
            ...product,
            qty: item.qty,
          };
        });
        return {
          ...this.cart,
          items: updatedCartItems,
        };
      });
  }

  resetCart() {
    this.cart = { items: [] };
    const db = getDb();
    return db.collection(COLLECTION_NAME.USERS).updateOne(
      { _id: new ObjectId(this._id) },
      {
        $set: {
          cart: this.cart,
        },
      }
    );
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection(COLLECTION_NAME.USERS)
      .findOne({ _id: new ObjectId(userId) });
  }
}

module.exports = User;
