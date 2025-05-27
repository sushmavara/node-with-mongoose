const express = require("express");
const shotController = require("../controllers/shop");

const routes = express.Router();

routes.get("/products/:productId", shotController.getProductDetailsPage);

routes.get("/products", shotController.getAllProducts);

routes.get("/", shotController.getShopIndexPage);

module.exports = routes;
