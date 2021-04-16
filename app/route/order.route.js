module.exports = function(app) {
  const order = require("../controller/order.controller.js");

  // Create a new Order
  app.post("/orders", order.create);

  // Retrieve a single Order with orderId
  app.get("/orders/:orderId", order.findOne);

  // Retrieve all orders
  app.get("/orders", order.findAll);

   // Update a order with orderId
   app.put("/orders/:orderId", order.update);

    // Delete a Order with orderId
    app.delete("/orders/:orderId", order.delete);

    // Delete all orders
    app.delete("/order", order.deleteAll); 


};