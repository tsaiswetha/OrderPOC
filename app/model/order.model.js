/*var express = require('express');

const sql = require("./db.js");

//start the express server
const app = express();

exports.create = 

(req,res)=>{

  
  sql.query('insert into Order(itemName,itemPrice,itemQuantity) values (?,?,?)' ,
                     [req.body.itemName, req.body.itemPrice,req.body.itemQuantity],
                    
                      (err,rows)=>{
                          if(!err)
                          {
                          console.log(req.body);
                          console.log("created customer: ", { id: res.orderId, ...req.body });
                          res(null, { id: res.orderId, ...req.body });
                          res.send('Order added succussfully');}
                          else
                          {
                            console.log(req.body);
                          throw err;
                          }
                      })

};
*/
const sql = require("./db.js");

// constructor
const Order = function(order) {
  this.itemName = order.itemName;
  this.itemPrice = order.itemPrice;
  this.itemQuantity = order.itemQuantity;
  this.id = order.id;
};

Order.create = (newOrder, result) => {
  sql.query("INSERT INTO testdb.order SET ?", newOrder, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created order: ", { orderId: res.insertId, ...newOrder });
    result(null, { orderId: res.insertId, ...newOrder });
  });
};



Order.findById = (orderId, result) => {
  sql.query(`SELECT * FROM testdb.order WHERE orderId = ${orderId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found order: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found order with the id
    result({ kind: "not_found" }, null);
  });
};



Order.getAll = result => {
  sql.query("SELECT * FROM testdb.order", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("orders: ", res);
    result(null, res);
  });
};


Order.updateById = (orderId, order, result) => {
  sql.query(
    "UPDATE testdb.order SET itemQuantity = ?, itemPrice = ? WHERE orderId = ?",
    [order.itemQuantity, order.itemPrice, orderId],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Order with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated order: ", { orderId: orderId, ...order });
      result(null, { orderId: orderId, ...order });
    }
  );
};


Order.remove = (orderId, result) => {
  sql.query("DELETE FROM testdb.order WHERE orderId = ?", orderId, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Order with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted order with id: ", orderId);
    result(null, res);
  });
};

Order.removeAll = result => {
  sql.query("DELETE FROM testdb.order", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} orders`);
    result(null, res);
  });
};


module.exports = Order;