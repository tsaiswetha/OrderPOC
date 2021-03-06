const Order = require("../model/order.model.js");

// Create and Save a new Customer
exports.create = (req, res) => {

    if (Object.keys(req.body).length==0) {
      return res.status(400).json({
        message: "Content can not be empty!"
      });
    }

  

  // Create a Order
  const order = new Order({
    itemName: req.body.itemName,
    itemPrice: req.body.itemPrice,
    itemQuantity: req.body.itemQuantity,
    id: req.body.id,
  });

  Order.create(order)
    .then((newOrder) => {
      res.status(201).json(newOrder);
    })
    .catch((err) => {
      return res.status(400).json({ error: err });
    });
};

// Find a single Order with a orderId
exports.findOne = (req, res) => {

  //Returning promise
  return new Promise((resolve,reject)=>{

  Order.findById(req.params.orderId)


    .then((data) => {
      return resolve(res.status(200).send(data));
    })
    .catch((err) => {
      if (err.result === "not_found") {
        return reject(res.status(404).send({
          message: `Not found Order with id ${req.params.orderId}.`
        }));
      } else {
        reject (res.status(500).send({
          message: "Error retrieving Order with id " + req.params.orderId,
        }));
      }
    });

  });
};

// Retrieve all Orders from the database.
exports.findAll = (req, res) => {
  Order.getAll()
    .then((data) => {
      if (data.result == "not_found") {
        res.status(404).send("No orders found");
      } else res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Internal Server Error",
      });
    });
};

// Update a Order identified by the orderId in the request
exports.update = (req, res) => {
  // Validate Request

  if (Object.keys(req.body).length == 0) {
    return res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  Order.updateById(req.params.orderId, new Order(req.body))
    .then((data) => {

      res.status(200).send({ UpdatedOrder: data });
    })
    .catch((err) => {
      console.log("error")
      if (err.kind === "not_found") {
        console.log("error in else")
        res.status(404).send({
          message: `Not found Order with id ${req.params.orderId}.`
        });
      } else {
        console.log("error in else")
        res.status(500).send({
          message: "Error updating Order with id " + req.params.orderId,
        });
      }
    });
};

// Delete a Order with the specified orderId in the request
/*  exports.delete = (req, res) => {
  Order.remove(req.params.orderId)
    .then((data) => {
      res.status(200).send("Order deleted successfully");
    })
    .catch((err) => {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Order with id ${req.params.orderId}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete Order with id " + req.params.orderId,
        });
      }
    });

 
};   

 */


//old code
// Delete a Order with the specified orderId in the request
exports.delete = (req, res) => {
/*   Order.remove(req.params.orderId)
    .then((data) => {
      res.status(200).send("Order deleted successfully");
    })
    .catch((err) => {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Order with id ${req.params.orderId}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete Order with id " + req.params.orderId,
        });
      }
    });
 */
    Order.remove(req.params.orderId, (err, data) => {
    /*  if (err) {
      return res.status(500).send({????????????????????????
        message:"Server Error - Could not clear Order with id " + req.params.orderId
              }????????????????????????);
      }  */
    /*    if (data.kind == "not_found") {????????????????????????
        return res.status(404).send({????????????????????????
        message:`Not found Order with id`
                }????????????????????????);
            }????????????????????????
    
       else res.send({ message: `Order cleared successfully!` });   */

       if(err)
       {
         console.log(err)
         return res.status(500).send({
          message:"Server Error - Could not clear Order with id " + req.params.orderId
         })

       }

       if(data.kind == "not_found"){
        return res.status(404).send({
          message:`Not found Order with id`
          })
       }

       else res.send({message: `Order cleared successfully!`})

  
  }); 
};

// Delete all Orders from the database.
exports.deleteAll = (req, res) => {

  Order.removeAll()
    .then((data) => {
      res.status(200).send("All orders cleared successfully");
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all customers.",
      });
    });
};
