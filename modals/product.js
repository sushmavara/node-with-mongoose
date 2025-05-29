// importing DB created with configuration in utils/database.js
const mysql = require("../utils/database");

class Product {
  constructor(title, description, imageUrl, price) {
    this.title = title;
    this.description = description;
    this.imageUrl = imageUrl;
    this.price = price;
    return this;
  }

  // Method will be called with object - hence this refers to the new product
  static addProduct(product) {
    return mysql.execute(
      "INSERT into products (title, description, imageUrl, price) VALUES (?,?,?,?)",
      [product.title, product.description, product.imageUrl, product.price]
    );
  }

  static updateProduct(product, productId) {
    return mysql.execute(
      "UPDATE products SET title = ?, description = ?, imageUrl = ?, price = ? WHERE id = ?",
      [
        product.title,
        product.description,
        product.imageUrl,
        product.price,
        productId,
      ]
    );
  }

  static deleteProduct(id) {
    return mysql.execute("DELETE from products where id =?", [id]);
  }

  static getProductById(id) {
    return mysql
      .execute("Select * from products where id =?", [id])
      .then(([products]) => {
        return products[0];
      });
  }

  static getAllProducts() {
    return mysql.execute("SELECT * FROM products");
  }
}

module.exports = Product;
