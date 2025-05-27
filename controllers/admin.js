const Cart = require("../modals/cart");
const Product = require("../modals/product");

const getAddProductPage = (req, res, next) => {
  res.render("./admin/add-product.ejs", {
    pageTitle: "Add Product",
    activeTab: "add-product",
    isEditing: false,
  });
};

const getEditProductPage = (req, res, next) => {
  const productId = req.params.productId;
  const isEditing = req.query.edit;
  if (!isEditing) {
    return;
  }

  Product.getProductById(productId, (productDetails) => {
    res.render("./admin/add-product.ejs", {
      pageTitle: "Edit Product",
      activeTab: "add-product",
      product: productDetails,
      isEditing,
    });
  });
};

const postAddProduct = (req, res, next) => {
  // with body parser library we get req.body which has the input
  const { title, description, imageUrl, price } = req.body || {};

  const product = new Product(title, description, imageUrl, Number(price));
  product.saveProduct(() => {
    res.redirect("/admin/products"); // Redirection is easy in express than venilla node js - where we need to set statusCode = 302 and set location in header for redirection
  });
};

const postUpdateProduct = (req, res, next) => {
  const { productId, ...rest } = req.body || {};
  const product = new Product(
    rest.title,
    rest.description,
    rest.imageUrl,
    rest.price,
    productId
  );
  Product.getProductById(productId, (oldProductDetails) => {
    Cart.updateCartPriceOnProductPriceChange(
      productId,
      oldProductDetails.price,
      rest.price
    );
  });
  product.updateProduct(() => {
    res.redirect("/admin/products"); // Redirection is easy in express than venilla node js - where we need to set statusCode = 302 and set location in header for redirection
  });
};

const deleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.getProductById(productId, (productDetails) => {
    Cart.deleteProductFromCart(productId, productDetails.price, () => {
      console.log("Hello 1");
      Product.deleteProduct(productId, () => {
        console.log("Hello 2");
        res.redirect("/admin/products");
      });
    });
  });
};

const getAllProducts = (req, res, next) => {
  Product.getAllProducts((products) => {
    res.render("./admin/products.ejs", {
      pageTitle: "Admin Products",
      activeTab: "admin-products",
      products,
      isAdmin: true,
    });
  });
};

module.exports = {
  getAddProductPage,
  postAddProduct,
  getAllProducts,
  getEditProductPage,
  postUpdateProduct,
  deleteProduct,
};
