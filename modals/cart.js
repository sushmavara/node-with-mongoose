const mysql = require("../utils/database");

const cartId = "SINGLE_CART"; // Assuming a single cart for simplicity, can be extended for multiple carts

class Cart {
  static async getCart() {
    return Promise.all([
      mysql.execute(
        "SELECT ci.qty as qty, p.title as title, p.imageUrl as imageUrl, p.price as price, p.description as description, ci.cart_id as cartId, ci.product_id as id from cart_items ci JOIN products p ON ci.product_id = p.id where ci.cart_id = ?",
        [cartId]
      ),
      mysql.execute(
        "SELECT sum(ci.qty) as totalQty from cart_items as ci where ci.cart_id = ?",
        [cartId]
      ),
      mysql.execute(
        "SELECT sum(ci.qty * p.price) as totalPrice from cart_items as ci JOIN products p on p.id = ci.product_id where ci.cart_id = ?",
        [cartId]
      ),
    ])
      .then(([[products], [qtyResult], [priceResult]]) => {
        return {
          id: cartId,
          products,
          totalQty: qtyResult[0].totalQty || 0,
          totalPrice: priceResult[0].totalPrice || 0,
        };
      })
      .catch((err) => {
        console.log("Failed to Load Cart", err);
      });
  }

  static async addProductToCart(productId) {
    // Make sure cart exists - Else create one
    return mysql
      .execute("INSERT IGNORE INTO cart (id) VALUES (?)", [cartId])
      .then(() => {
        // ? Check if cart item exists with same cartId and productId
        return mysql.execute(
          "SELECT * from cart_items where cart_Id = ? AND product_id = ?",
          [cartId, productId]
        );
      })
      .then(([products]) => {
        const productDetails = products[0];
        // product already exists then we need to update the qty
        if (productDetails) {
          return mysql.execute(
            "UPDATE cart_items SET qty = qty + 1 WHERE cart_Id = ? AND product_id = ?",
            [cartId, productId]
          );
        } else {
          // we need to add new row
          return mysql.execute(
            "INSERT INTO cart_items (cart_Id, product_id, qty) VALUES (?, ?, ?)",
            [cartId, productId, 1]
          );
        }
      })
      .catch((err) => {
        console.error("Error initializing cart in database", err);
      });
  }

  static async deleteProductFromCart(productId, qtyToDelete) {
    if (!qtyToDelete) {
      return mysql.execute("DELETE from shop.cart_items where product_id=?", [
        productId,
      ]);
    }
    return mysql
      .execute("SELECT * from cart_items where product_id =? AND cart_id = ?", [
        productId,
        cartId,
      ])
      .then(([cart_products]) => {
        const currentProductQty = cart_products[0].qty;
        if (Number(currentProductQty) === Number(qtyToDelete)) {
          return mysql.execute(
            "DELETE from shop.cart_items where product_id=?",
            [productId]
          );
        } else {
          return mysql.execute(
            "Update shop.cart_items set qty = qty - ? WHERE cart_id = ? AND product_id = ?",
            [qtyToDelete, cartId, productId]
          );
        }
      });
  }
}

module.exports = Cart;
