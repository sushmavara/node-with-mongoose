const Product = require("../modals/product");

const getShopIndexPage = (req, res, next) => {
  res.render("./shop/index.ejs", {
    pageTitle: "Shop",
    activeTab: "shop",
  });
};

const getProductDetailsPage = (req, res, next) => {
  const productId = req.params.productId;

  Product.getProductById(productId, (product) => {
    res.render("./shop/product-details.ejs", {
      product,
      pageTitle: "Product Details",
      activeTab: "shop-products",
    });
  });
};

const getAllProducts = (req, res, next) => {
  Product.getAllProducts((products) => {
    res.render("./shop/products.ejs", {
      pageTitle: "Products",
      activeTab: "shop-products",
      products,
      isAdmin: false,
    });
  });
};

module.exports = {
  getShopIndexPage,
  getProductDetailsPage,
  getAllProducts,
};
