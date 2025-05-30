const Product = require("../modals/product");

const getShopIndexPage = (req, res, next) => {
  res.render("./shop/index.ejs", {
    pageTitle: "Shop",
    activeTab: "shop",
  });
};

const getProductDetailsPage = (req, res, next) => {
  const productId = req.params.productId;
  Product.findByPk(productId)
    .then((product) => {
      res.render("./shop/product-details.ejs", {
        product: product,
        pageTitle: `Product Details: ${product.title}`,
        activeTab: "shop-products",
      });
    })
    .catch((err) => {
      console.log("Error fetching product details:", err);
      res.status(500).send("Internal Server Error");
    });
};

const getAllProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("./shop/products.ejs", {
        pageTitle: "Products",
        activeTab: "shop-products",
        products,
        isAdmin: false,
      });
    })
    .catch((err) => {
      console.log("Error fetching products:", err);
      res.status(500).send("Internal Server Error");
    });
};

module.exports = {
  getShopIndexPage,
  getProductDetailsPage,
  getAllProducts,
};
