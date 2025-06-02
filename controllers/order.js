const OrderItem = require("../modals/order-item");
const Product = require("../modals/product");

const getOrdersPage = (req, res, next) => {
  return req.user
    .getOrders({
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              required: false, // 👈 allows product to be missing (deleted)
            },
          ],
        },
      ],
    })
    .then((orders) => {
      const orderIdVsTotal = orders.reduce((acc, order) => {
        const totalPrice = order.orderItems.reduce((acc, item) => {
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
  let fetchedCart;
  req.user.createOrder().then((order) => {
    req.user
      .getCart()
      .then((cart) => {
        fetchedCart = cart;
        return cart.getProducts();
      })
      .then((products) => {
        return products.map((product) => {
          order.createOrderItem({
            productId: product.id,
            title: product.title,
            price: product.price,
            qty: product.cartItem.qty,
          });
          return order;
        });
      })
      .then(() => {
        return fetchedCart.setProducts([]);
      })
      .then(() => {
        res.redirect("./orders");
      })
      .catch((err) => {
        console.log("Failed to create order", err);
      });
  });
};

module.exports = {
  getOrdersPage,
  createOrder,
};
