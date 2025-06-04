const Order = require("../modals/order");

const getOrdersPage = (req, res, next) => {
  Order.getAllOrders(req.user._id).then((orders) => {
    const orderIdVsTotal = orders.reduce((acc, order) => {
      const totalPrice = order.items.reduce((acc, item) => {
        return acc + item.qty * item.price;
      }, 0);
      return {
        ...acc,
        [order.id]: totalPrice,
      };
    }, {});
    res.render("./order/orders.ejs", {
      pageTitle: "Orders",
      activeTab: "orders",
      orders: orders.reverse(),
      orderIdVsTotal,
    });
  });
};

const createOrder = (req, res, next) => {
  req.user.getCart().then(({ items }) => {
    const updatedItems = items.map((item) => ({
      title: item.title,
      description: item.description,
      price: item.price,
      qty: item.qty,
      imageUrl: item.imageUrl,
    }));
    const order = new Order(updatedItems, req.user._id);
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
