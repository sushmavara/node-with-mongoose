const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const rootDir = require("../utils/path");

const productStoreFilePath = path.join(rootDir, "data", "products.json");

const getProductsFromFile = (cb) => {
  // readFile is async process and its gives err and filecontent - err when the file specified doesnt exits
  fs.readFile(productStoreFilePath, (err, fileContent) => {
    let products = [];
    // File doesnt exists that means it is the first product
    if (!err) {
      products = JSON.parse(fileContent);
    }
    cb(products);
  });
};

class Product {
  constructor(title, description, imageUrl, price, id) {
    this.id = id || uuid();
    this.title = title;
    this.description = description;
    this.imageUrl = imageUrl;
    this.price = price;
    return this;
  }

  // Method will be called with object - hence this refers to the new product
  saveProduct(cb) {
    getProductsFromFile((products) => {
      products.push(this);
      fs.writeFile(productStoreFilePath, JSON.stringify(products), (err) => {
        // Calling the callback here
        cb();
      });
    });
  }

  updateProduct(cb) {
    getProductsFromFile((products) => {
      const productIndex = products.findIndex((p) => p.id === this.id);
      const updatedProducts = [...products];
      updatedProducts[productIndex] = this;
      fs.writeFile(
        productStoreFilePath,
        JSON.stringify(updatedProducts),
        (err) => {
          cb();
        }
      );
    });
  }

  static deleteProduct(id, cb) {
    getProductsFromFile((products) => {
      const updatedProducts = products.filter((prod) => prod.id !== id);
      fs.writeFile(
        productStoreFilePath,
        JSON.stringify(updatedProducts),
        (err) => {
          console.log("Product error", err);
          cb();
        }
      );
    });
  }

  static getProductById(id, cb) {
    getProductsFromFile((products) => {
      const productDetails = products.find((p) => p.id === id);
      return cb(productDetails);
    });
  }

  static getAllProducts(cb) {
    getProductsFromFile((products) => cb(products));
  }
}

module.exports = Product;
