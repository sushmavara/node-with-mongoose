const path = require("path");
const fs = require("fs");

const rootDir = require("../utils/path");

const cartStorePath = path.join(rootDir, "data", "cart.json");

const getCartStoreFromFile = (cb) => {
  fs.readFile(cartStorePath, (err, fileContent) => {
    let cart = { products: [], totalPrice: 0 };
    if (!err) {
      cart = JSON.parse(fileContent);
    }
    cb(cart);
  });
};

class Cart {
  static getCart(cb) {
    getCartStoreFromFile(cb);
  }

  static addProductToCart(id, price, cb) {
    getCartStoreFromFile((cart) => {
      let updatedProducts = [];
      const productDetails = cart.products.find((p) => p.id === id);
      if (productDetails) {
        const prodIndex = cart.products.findIndex((p) => p.id === id);
        updatedProducts = [...cart.products];
        updatedProducts[prodIndex] = {
          ...productDetails,
          qty: productDetails.qty + 1,
        };
      } else {
        updatedProducts = [...cart.products, { id, qty: 1 }];
      }
      const updatedCart = {
        products: updatedProducts,
        totalPrice: cart.totalPrice + +price,
      };
      fs.writeFile(cartStorePath, JSON.stringify(updatedCart), (err) => {
        cb();
      });
    });
  }

  static updateCartPriceOnProductPriceChange(id, oldPrice, newPrice) {
    getCartStoreFromFile((cart) => {
      const productDetails = cart.products.find((p) => p.id === id);
      if (!productDetails) {
        return;
      }
      cart.totalPrice =
        cart.totalPrice -
        productDetails.qty * oldPrice +
        productDetails.qty * newPrice;

      fs.writeFile(cartStorePath, JSON.stringify(cart), (err) => {
        // console.log(err);
      });
    });
  }

  static deleteProductFromCart(id, price, cb) {
    getCartStoreFromFile((cart) => {
      const productToDetelte = cart.products.find((p) => p.id === id);
      if (!productToDetelte) {
        cb();
        return;
      }
      const updatedPrice = cart.totalPrice - productToDetelte.qty * price;
      const updatedProducts = cart.products.filter((p) => p.id !== id);
      const updatedCart = {
        products: updatedProducts,
        totalPrice: updatedPrice,
      };
      fs.writeFile(cartStorePath, JSON.stringify(updatedCart), (err) => {
        // err handling
        cb();
      });
    });
  }

  static deleteProductQtyFromCart(id, price, qty, cb) {
    getCartStoreFromFile((cart) => {
      const productToDetelte = cart.products.find((p) => p.id === id);
      if (!productToDetelte) {
        cb();
        return;
      }
      const qtyToDelete = +(qty === null ? productToDetelte.qty : qty);
      const updatedPrice = cart.totalPrice - qtyToDelete * price;

      const updatedProducts = cart.products.reduce((acc, cp) => {
        if (cp.id !== id) {
          return [...acc, cp];
        }
        if (cp.qty === qtyToDelete) {
          return [...acc];
        }
        return [...acc, { ...cp, qty: cp.qty - qtyToDelete }];
      }, []);

      const updatedCart = {
        products: updatedProducts,
        totalPrice: updatedPrice,
      };
      fs.writeFile(cartStorePath, JSON.stringify(updatedCart), () => {
        cb();
      });
    });
  }
}

module.exports = Cart;
