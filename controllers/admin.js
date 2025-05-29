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

  Product.getProductById(productId)
    .then((product) => {
      res.render("./admin/add-product.ejs", {
        pageTitle: "Edit Product",
        activeTab: "add-product",
        product: product,
        isEditing,
      });
    })
    .catch((err) => {
      console.log("Error Editing Product Details:", err);
      res.status(500).send("Internal Server Error");
    });
};

const postAddProduct = (req, res, next) => {
  // with body parser library we get req.body which has the input
  const { title, description, imageUrl, price } = req.body || {};
  const product = new Product(title, description, imageUrl, Number(price));

  Product.addProduct(product)
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

const postUpdateProduct = (req, res, next) => {
  const { productId, ...rest } = req.body || {};
  const product = new Product(
    rest.title,
    rest.description,
    rest.imageUrl,
    rest.price
  );
  Product.updateProduct(product, productId)
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log("Error updating product:", err);
    });
};

const deleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.deleteProduct(productId)
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log("Error deleting product:", err);
    });
};

const getAllProducts = (req, res, next) => {
  // db queries are promises
  Product.getAllProducts()
    .then(([products, fieldData]) => {
      // products is an array of objects
      // fieldData is an array of objects with metadata about the fields
      // We can use products and fieldData to render the page

      res.render("./admin/products.ejs", {
        pageTitle: "Admin Products",
        activeTab: "admin-products",
        products,
        isAdmin: true,
      });
    })
    .catch((err) => {
      console.error("Error fetching products:", err);
      res.status(500).send("Internal Server Error");
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
