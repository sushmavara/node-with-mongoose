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

  Product.findByPk(productId)
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
  req.user
    .createProduct({
      title,
      description,
      imageUrl,
      price: Number(price),
    })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

const postUpdateProduct = (req, res, next) => {
  const { productId, ...rest } = req.body || {};
  Product.findByPk(productId)
    .then((product) => {
      product
        .update({
          title: rest.title,
          description: rest.description,
          imageUrl: rest.imageUrl,
          price: rest.price,
        })
        .then(() => {
          res.redirect("/admin/products");
        })
        .catch((err) => {
          console.log("Error updating product:", err);
        });
    })
    .catch((err) => {
      console.log("Error updating product:", err);
    });
};

const deleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.destroy({ where: { id: productId } })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log("Error deleting product:", err);
    });
};

const getAllProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
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
