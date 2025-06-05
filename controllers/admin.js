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

  Product.findById(productId) // findById is a mongoose method
    .then((product) => {
      res.render("./admin/add-product.ejs", {
        pageTitle: "Edit Product",
        activeTab: "add-product",
        product,
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
  const product = new Product({
    title,
    description,
    imageUrl,
    price,
    userId: req.user._id,
  }); // create a new instance of Product model in mongoose structure
  product
    .save() // Save is a mongoose method given over model
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

const postUpdateProduct = (req, res, next) => {
  const { productId, title, description, imageUrl, price } = req.body || {};
  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return res.status(404).send("Product not found");
      }
      product.title = title;
      product.description = description;
      product.imageUrl = imageUrl;
      product.price = price;
      return product.save();
    })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log("Error updating product:", err);
    });
};

const deleteProduct = (req, res, next) => {
  const productId = req.body.productId;

  Product.findByIdAndDelete(productId)
    .then(() => {
      return req.user.deleteItemFromCart(productId);
    })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log("Error deleting product:", err);
    });
};

const getAllProducts = (req, res, next) => {
  Product.find() // find is a mongoose method that retrieves all products
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
