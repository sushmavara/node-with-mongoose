const express = require("express");
const adminController = require("../controllers/admin");

const routes = express.Router(); // This routes acts like mini express hence we can use get, post , use and other methods on it

// To parse the data express support body parser library which can be installed
routes.get("/add-product", adminController.getAddProductPage);

routes.post("/add-product", adminController.postAddProduct);

routes.get("/edit-product/:productId", adminController.getEditProductPage);

routes.post("/edit-product", adminController.postUpdateProduct);

routes.post("/delete-product", adminController.deleteProduct);

routes.get("/products", adminController.getAllProducts);

module.exports = routes;
