const Cart = require("../modals/cart");
const Product = require("../modals/product");

const hanldeAddToCart = (req, res, next) => {
  const productId = req.body.productId;
  const redirectTo = req.query.redirectTo;
  const url = req.url;
  Product.getAllProducts((products) => {
    const productDetails = products.find((p) => p.id === productId);
    Cart.addProductToCart(productDetails?.id, productDetails?.price, () => {
      if (redirectTo) {
        res.redirect(redirectTo);
      } else {
        res.redirect("/products");
      }
    });
  });
};

const getCartPage = (req, res, next) => {
  Cart.getCart((cart) => {
    Product.getAllProducts((allProducts) => {
      const { totalQty, cartProducts } = cart.products.reduce(
        (acc, cp) => {
          const productDetails = allProducts.find((p) => p.id === cp.id);
          return {
            cartProducts: [
              ...acc.cartProducts,
              { ...cp, details: productDetails },
            ],
            totalQty: acc.totalQty + cp.qty,
          };
        },
        { totalQty: 0, cartProducts: [] }
      );

      res.render("./cart/cart-details.ejs", {
        pageTitle: "Cart",
        activeTab: "cart",
        cart: {
          ...cart,
          products: cartProducts,
          totalQty,
        },
      });
    });
  });
};

const handleDelete = (req, res, next) => {
  const qtyToDelete = req.query.qty || null;
  const productId = req.body.productId;

  Product.getAllProducts((products) => {
    const productDetails = products.find((p) => p.id === productId);
    Cart.deleteProductQtyFromCart(
      productId,
      productDetails.price,
      qtyToDelete,
      () => {
        res.redirect("/cart");
      }
    );
  });
};

module.exports = {
  hanldeAddToCart,
  getCartPage,
  handleDelete,
};
