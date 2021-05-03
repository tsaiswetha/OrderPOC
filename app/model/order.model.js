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



Order.create=newOrder =>{
  return new Promise((resolve,reject)=>{
    sql.query("INSERT INTO testdb.orders SET ?", newOrder, (err, res) => {
          if (err) {
            console.log("error: ", err);
            return reject(err);
           // return reject("Error occured");
          }
      
          console.log("created order: ", { orderID: res.insertId, ...newOrder });
          resolve({ orderID: res.insertId, ...newOrder });
        });
  });
}



Order.findById = (orderId) => {

  return new Promise((resolve,reject)=>{
  sql.query(`SELECT * FROM testdb.orders WHERE orderId = ${orderId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
     // result(err, null);
      //return;
       return reject(err);
    }

    if (res.length) {
      console.log("found order: ", res[0]);
     // result(null, res[0]);
     //return
       resolve(res[0]);
    }

    // not found order with the id
    //result({ kind: "not_found" }, null);
    reject({ result: "not_found" })

  });
});
};



Order.getAll = () => {

  return new Promise((resolve,reject)=>{
  sql.query("SELECT * FROM testdb.orders", (err, res) => {
    if (err) {
      console.log("error: ", err);
     // result(null, err);
      //return;

      return reject(err);
    }
    if (res.length) {
      console.log("found order: ", res[0]);
     // result(null, res[0]);
     //return
     return  resolve(res);
    }
    resolve({ result: "not_found" })
  
  });

});
};


Order.updateById = (orderId, order) => {

  return new Promise((resolve,reject)=>{
  sql.query(
    "UPDATE testdb.orders SET itemQuantity = ?, itemPrice = ? WHERE orderId = ?",
    [order.itemQuantity, order.itemPrice, orderId],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
       // result(null, err);
        //return;
        return reject(err)
      }

      if (res.affectedRows == 0) {
        // not found Order with the id
       // result({ kind: "not_found" }, null);
        //return;
       return  reject({ kind: "not_found" })
      }

     // console.log("updated order: ", { orderId: orderId, ...order });
      //result(null, { orderId: orderId, ...order });
      console.log("updated order: ")
      resolve({ orderId: orderId, ...order });
    }
  );
});
};


  /* Order.remove = (orderId) => {

  return new Promise((resolve,reject)=>{
  sql.query("DELETE FROM testdb.orders WHERE orderId = ?", orderId, (err, res) => {
    if (err) {
      console.log("error: ", err);
     // result(null, err);
     // return;
     return reject(err)
    }

    if (res.affectedRows == 0) {
    
     // result({ kind: "not_found" }, null);
     // return;

      return reject({ kind: "not_found" })
    }

    console.log("deleted order with id: ", orderId);
   // result(null, res);

     return resolve(res)
  });

});
};
 */  



//old code

//Order.remove = (orderId) => {

  Order.remove = (orderId, result) => {

 // return new Promise((resolve,reject)=>{
  sql.query("DELETE FROM testdb.orders WHERE orderId = ?", orderId, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
     //return reject(err)
    }

    if (res.affectedRows == 0) {
      // not found Order with the id
      result(null, { kind: "not_found" });
      return;

     // return reject({ kind: "not_found" })
    }

    console.log("deleted order with id: ", orderId);
   result(null, res);

     //return resolve(res)
  });

//});
};


Order.removeAll = result => {

  return new Promise((resolve,reject)=>{
  sql.query("DELETE FROM testdb.orders", (err, res) => {
    if (err) {
      console.log("error: ", err);
     // result(null, err);
     // return;
     return reject(err);
    }

    console.log(`deleted ${res.affectedRows} orders`);
    //result(null, res);
    resolve(res);
  });

});
};


module.exports = Order;