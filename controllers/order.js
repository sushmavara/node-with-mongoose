const Order = require("../modals/order");

const getOrdersPage = (req, res, next) => {
  Order.find({
    "user.userId": req.user._id,
  })
    // .populate("items.productId") // Not need here as we have sufficient data in the order
    .then((orders) => {
      res.render("./order/orders.ejs", {
        pageTitle: "Orders",
        activeTab: "orders",
        orders: orders.reverse(), // Reverse to show latest orders first
      });
    });
};

const createOrder = (req, res, next) => {
  req.user.populate("cart.items.productId").then((user) => {
    const updatedItems = user.cart.items.map((item) => ({
      title: item.productId.title,
      description: item.productId.description,
      price: item.productId.price,
      qty: item.qty,
      imageUrl: item.productId.imageUrl,
      productId: item.productId,
    }));
    const totalPrice = updatedItems.reduce((acc, item) => {
      return acc + item.price * item.qty;
    }, 0);
    const order = new Order({
      items: updatedItems,
      user: {
        userId: req.user._id,
        name: req.user.name,
      },
      totalPrice,
    });
    order
      .save()
      .then(() => {
        return req.user.resetCart();
      })
      .then(() => {
        res.redirect("./orders");
      })
      .catch((err) => {
        console.log("Failed to save order", err);
        res.status(500).send("Internal Server Error");
      });
  });
};

module.exports = {
  getOrdersPage,
  createOrder,
};
