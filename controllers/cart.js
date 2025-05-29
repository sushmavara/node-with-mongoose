const Cart = require("../modals/cart");
const Product = require("../modals/product");

const hanldeAddToCart = (req, res, next) => {
  const productId = req.body.productId;
  const redirectTo = req.query.redirectTo;
  Cart.addProductToCart(productId).then(() => {
    if (redirectTo) {
      res.redirect(redirectTo);
    } else {
      res.redirect("/products");
    }
  });
};

const getCartPage = (req, res, next) => {
  Cart.getCart()
    .then((cart, totalQty) => {
      res.render("./cart/cart-details.ejs", {
        pageTitle: "Cart",
        activeTab: "cart",
        cart: cart,
        totalQty,
      });
    })
    .catch((err) => console.log("Failed", err));
};

const handleDelete = (req, res, next) => {
  const qtyToDelete = req.query.qty || null;
  const productId = req.body.productId;

  Cart.deleteProductFromCart(productId, qtyToDelete)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log("Failed", err);
    });
};

module.exports = {
  hanldeAddToCart,
  getCartPage,
  handleDelete,
};
