const { ObjectId } = require("mongodb");
const { getDb } = require("../utils/database");

const { COLLECTION_NAME } = require("../constants/db");

class Product {
  constructor(title, description, imageUrl, price, userId, id) {
    this.title = title;
    this.description = description;
    this.imageUrl = imageUrl;
    this.price = price;
    this.userId = userId;
    this._id = id ? new ObjectId(id) : null;
  }

  // called on object with obj.createProduct
  create() {
    const db = getDb();
    return db.collection(COLLECTION_NAME.PRODUCTS).insertOne(this);
  }

  // called on object
  update() {
    const db = getDb();
    const newId = new ObjectId(this._id);
    return db.collection(COLLECTION_NAME.PRODUCTS).updateOne(
      { _id: newId },
      {
        $set: {
          title: this.title,
          description: this.description,
          imageUrl: this.imageUrl,
          price: this.price,
        },
      }
    );
  }

  // called on object
  static deleteProduct(productId) {
    const db = getDb();
    return db
      .collection(COLLECTION_NAME.PRODUCTS)
      .deleteOne({ _id: new ObjectId(productId) });
  }

  static getAllProducts() {
    const db = getDb();
    return db.collection(COLLECTION_NAME.PRODUCTS).find().toArray(); // .toArray() converts the cursor to an array of documents
  }

  static getProductById(productId) {
    const db = getDb();
    return db.collection(COLLECTION_NAME.PRODUCTS).findOne({
      _id: new ObjectId(productId),
    });
  }
}

module.exports = Product;
