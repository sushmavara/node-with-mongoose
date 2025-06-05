const hanldeAddToCart = (req, res, next) => {
  const productId = req.body.productId;
  const redirectTo = req.query.redirectTo;

  req.user
    .addToCart(productId)
    .then(() => {
      if (redirectTo) {
        res.redirect(redirectTo);
      } else {
        res.redirect("/products");
      }
    })
    .catch((err) => {
      console.log("Failed to add to cart", err);
    })
    .catch((err) => {
      console.log("Failed to add to cart", err);
    });
};

const getCartPage = (req, res, next) => {
  req.user
    .populate("cart.items.productId") // Mongoose method to populate the cart items with product details
    .then((user) => {
      const products = user.cart.items;
      const { totalQty, totalPrice } = products.reduce(
        (acc, cp) => {
          return {
            totalPrice: acc.totalPrice + cp.productId.price * cp.qty,
            totalQty: acc.totalQty + cp.qty,
          };
        },
        {
          totalPrice: 0,
          totalQty: 0,
        }
      );
      res.render("./cart/cart-details.ejs", {
        pageTitle: "Cart",
        activeTab: "cart",
        products,
        totalQty,
        totalPrice,
      });
    })
    .catch((err) => console.log("Failed", err));
};

const handleDeleteItemByQty = (req, res, next) => {
  const productId = req.body.productId;
  let qtyToDelete = req.query.qty || 1;
  req.user
    .deleteItemByQty(productId, qtyToDelete)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log("Failed to remove item from cart", err);
    });
};

const handleDeleteItem = (req, res, next) => {
  const productId = req.body.productId;

  req.user
    .deleteItemFromCart(productId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log("Failed to remove item from cart", err);
    });
};

module.exports = {
  hanldeAddToCart,
  getCartPage,
  handleDeleteItem,
  handleDeleteItemByQty,
};
