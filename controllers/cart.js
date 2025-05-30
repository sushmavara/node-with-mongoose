const { cartId } = require("../constants/cart");
const Cart = require("../modals/cart");
const Product = require("../modals/product");

const hanldeAddToCart = (req, res, next) => {
  const productId = req.body.productId;
  const redirectTo = req.query.redirectTo;
  let fetchedCart;
  let newQty;

  Cart.findByPk(cartId)
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({
        where: {
          id: productId,
        },
      });
    })
    .then(([product]) => {
      newQty = 1;

      if (product) {
        newQty = product.cartItem.qty + 1;
        return product;
      } else {
        return Product.findByPk(productId);
      }
    })
    .then((product) => {
      return fetchedCart.addProduct(product, { through: { qty: newQty } });
    })
    .then(() => {
      if (redirectTo) {
        res.redirect(redirectTo);
      } else {
        res.redirect("/products");
      }
    })
    .catch((err) => {
      console.log("Failed to add to cart", err);
    });
};

const getCartPage = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts();
    })
    .then((products) => {
      const { totalQty, totalPrice } = products.reduce(
        (acc, product) => {
          return {
            totalPrice: acc.totalPrice + product.price * product.cartItem.qty,
            totalQty: acc.totalQty + product.cartItem.qty,
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

const handleDelete = (req, res, next) => {
  const qtyToDelete = req.query.qty || null;
  const productId = req.body.productId;

  Cart.findOne({
    where: {
      id: cartId,
    },
  })
    .then((cart) => {
      return cart.getProducts({
        where: {
          id: productId,
        },
      });
    })
    .then(([product]) => {
      if (qtyToDelete) {
        const currentQty = product.cartItem.qty;
        if (Number(currentQty) === Number(qtyToDelete)) {
          return product.cartItem.destroy();
        } else {
          product.cartItem.qty = product.cartItem.qty - qtyToDelete;
          return product.cartItem.save();
        }
      }
      return product.cartItem.destroy();
    })
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
