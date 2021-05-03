const chai = require("chai");
const sinon = require("sinon");
const expect = chai.expect;
//const faker = require("faker");

const OrderController = require("../controller/order.controller.js");
const OrderModel = require("../model/order.model.js");

describe("OrderController", function () {
  describe("post method tests", function () {
    let status, json, createOrderStub, response ;

    beforeEach(() => {
      status = sinon.stub();
      json = sinon.spy();
      response = { json, status };
      status.returns(response);
      createOrderStub = sinon.stub(OrderModel, "create");

    });


    it("should create an order when item name,price,quantity and id are given", async function () {

      //given
      const request = {
        body: {
          itemName: "Samsung",
          itemPrice: "234567",
          itemQuantity: "12",
          id: 1,
        },
      };

      const result = {
        orderId: 2,
        itemName: "Samsung",
        itemPrice: "234567",
        itemQuantity: "12",
        id: 1,
      };

     
      createOrderStub.returns(Promise.resolve(result));

      //when
      await OrderController.create(request, response);

      let responseStatus = status.args[0][0];
      let responseJson = json.args[0][0];

      //then
      expect(createOrderStub.calledOnce).to.be.true;
      expect(status.calledOnce).to.be.true;
      expect(status.calledOnce).to.be.true;
      expect(responseStatus).to.equal(201);
      expect(json.calledOnce).to.be.true;
      expect(responseJson).to.equal(result);
    });

  

    it("should not create an order when itemName is not given", async function () {

      //given
      const request = {
        body: {
          itemPrice: "234567",
          itemQuantity: "12",
          id: 1,
        },
      };

      const err = "Invalid Params";

      createOrderStub.returns(Promise.reject(err));

    
      //when
      await OrderController.create(request, response);

      
     //let responseStatus = status.args[0][0];
     //let responseJson = json.args[0][0];

    
      //then
      setTimeout(() => {
        expect(createOrderStub.calledOnce).to.be.true;
        expect(status.calledOnce).to.be.true;
        expect(status.args[0][0]).to.equal(400);
        expect(json.calledOnce).to.be.true;
        expect(json.args[0][0]).to.eql({ error: err });
      });
    });

    it("should return msg", async()=>{

      //given

      const req = {body:{}}

      const message ={message: "Content can not be empty!"};

      await OrderController.create(req,response)


      expect(status.calledOnce).to.be.true;
     // expect(res.json.args[][].)



    });



    afterEach(() => {

      createOrderStub.restore();

    });
  });

  describe("get method tests", function () {
    let status, send, res, orderStub, req, orderStubFindById;

    beforeEach(() => {
      status = sinon.stub();
      send = sinon.spy();
      res = { send, status };
      status.returns(res);

      orderStub = sinon.stub(OrderModel, "getAll");
      orderStubFindById = sinon.stub(OrderModel, "findById");
    });

    it("should get all the orders", async function () {
      //given
      const newOrderList = [
        {
          orderId: 1,
          itemName: "Samsung",
          itemPrice: "234567",
          itemQuantity: "12",
          id: 1,
        },
        {
          orderId: 2,
          itemName: "Micromax",
          itemPrice: "234567",
          itemQuantity: "2",
          id: 1,
        },
      ];

      orderStub.returns(Promise.resolve(newOrderList));

      //when
       await OrderController.findAll(req, res);

      //then
      expect(orderStub.calledOnce).to.be.true;
      expect(status.calledOnce).to.be.true;
     expect(status.args[0][0]).to.equal(200);
      expect(send.calledOnce).to.be.true;
      expect(send.args[0][0]).to.eql(newOrderList);
    });

    it("should get an order when id is given", async function () {

      //given
      req = { params: { orderId: 2 } };

      const newOrder = {
        orderId: req.params.orderId,
        itemName: "Samsung",
        itemPrice: "234567",
        itemQuantity: "12",
        id: 1,
      };

     
      orderStubFindById.returns(Promise.resolve(newOrder));

      //when
      await OrderController.findOne(req, res);

      //then
      expect(orderStubFindById.calledOnce).to.be.true;
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(200);
      expect(send.calledOnce).to.be.true;
      expect(send.args[0][0]).to.eql(newOrder);
    });

    it("should return message when no orders are present", async function () {

      //given

      const data = { result: "not_found" };

      const message = "No orders found";

      orderStub.returns(Promise.resolve(data));

      //when
      await OrderController.findAll(req, res);

      //then
      expect(orderStub.calledOnce).to.be.true;
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(404);
      expect(send.calledOnce).to.be.true;
      expect(send.args[0][0]).to.eql(message);
    });

    it("should return error when getAll rejects", async function () {

      //given
      const err = "Internal Server Error";

      orderStub.returns(Promise.reject(err));

      //when
      await OrderController.findAll(req, res);

      //then
      setTimeout(() => {
        expect(orderStub.calledOnce).to.be.true;
        expect(status.calledOnce).to.be.true;
        expect(status.args[0][0]).to.equal(500);
        expect(send.calledOnce).to.be.true;
        expect(send.args[0][0]).to.eql({ message: err });
      });
    });

    it("should return error when id is not found", async function () {

      //given
      req = { params: { orderId: 2 } };

      const err = `Not found Order with id ${req.params.orderId}.`;
      const rejectJSON = { result: "not_found" };

      const newOrder = {
        orderId: 3,
        itemName: "Samsung",
        itemPrice: "234567",
        itemQuantity: "12",
        id: 1,
      };

      orderStubFindById.returns(Promise.reject(rejectJSON));

      //when
      await OrderController.findOne(req, res);

      //then
      setTimeout(() => {
        expect(orderStubFindById.calledOnce).to.be.true;
        expect(status.calledOnce).to.be.true;
        expect(status.args[0][0]).to.equal(404);
        expect(send.calledOnce).to.be.true;
        expect(send.args[0][0]).to.eql({ message: err });
      });
    });

    afterEach(() => {
      orderStub.restore();
      orderStubFindById.restore();
    });
  });

  describe("update method tests", function () {
    let status, send, res, updateStub, req;

    beforeEach(() => {
      status = sinon.stub();
      send = sinon.spy();
      res = { send, status };
      status.returns(res);

      updateStub = sinon.stub(OrderModel, "updateById");
    });

    it.only("should update order by id", async function () {

      //given
      const toUpdate = {
        itemName: "Samsung",
        itemPrice: "234567",
      };

      req = { params: { orderId: 2 }, body: toUpdate };

      const result = { orderId: 2, itemName: "Samsung", itemPrice: "234567" };

      const ErrMsg = {
        message: `Not found Order with id ${req.params.orderId}.`
      }

      // const rejectErr = {
      //   kind : "not_found"
      // }

      const rejectErr = "err";


     updateStub.onFirstCall().returns(Promise.resolve(result))
                .onSecondCall().returns(Promise.reject(rejectErr));

     
      //when first call
      await OrderController.update(req, res);
 

      //then  
      expect(updateStub.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(200);

  

     //when second call
      await OrderController.update(req, res);

      setTimeout(() => {
      expect(updateStub.calledTwice).to.be.true;
      expect(status.calledTwice).to.be.true;
      expect(status.args[1][0]).to.equal(500);

      });


     // expect(status.args[2][1]).to.equal(500);

    // expect(status.calledOnce).to.be.true;
     // expect(status.args[0][0]).to.equal(200);
     // expect(send.calledOnce).to.be.true;
     // expect(send.args[0][0]).to.eql({ UpdatedOrder: result }); 

     // updateStub.onSecondCall().returns(Promise.reject(rejectErr));

       //when
      // await OrderController.update(req, res);

       //then
      // expect(updateStub.calledTwice).to.be.true;
      // expect(status.calledOnce).to.be.true;
      // expect(status.args[0][0]).to.equal(404);
      //  expect(send.calledOnce).to.be.true;
      //  expect(send.args[0][0]).to.eql({ UpdatedOrder: result });
 

     // expect(OrderController.update(req, res).send.args[0][0]).to.eql({ UpdatedOrder: result });


    });

    it("should return msg", async()=>{

      //given

      req = {body:{}}

      const message ={message: "Content can not be empty!"};

      await OrderController.update(req,res)


      expect(status.calledOnce).to.be.true;



    });

    
    it( "calling the last callback", function () {

        var callback = sinon.stub();

        const data = "hello"
        const value = "23"
        

        callback(function (data) {
            console.log("Success!"+data);
        }, function (value) {
            console.log("Oh noes!"+value);
        });
    
     //   callback.callArg(0); // Logs "Oh noes!"

       callback.callsArgWith(0, data);

    });



    afterEach(() => {
      updateStub.restore();
    });
  });

  describe("delete method tests", function () {
    let status, send, res, deleteStub, req;

    beforeEach(() => {
      status = sinon.stub();
      send = sinon.spy();
      res = { send, status };
      status.returns(res);

      deleteStub = sinon.stub(OrderModel, "remove");
      deleteAllStub = sinon.stub(OrderModel, "removeAll");
    });

    it("should delete order by id", async function () {

      //given
      req = { params: { orderId: 2 } };

      const message = "Order deleted successfully";

      deleteStub.returns(Promise.resolve(message));

      //when
      await OrderController.delete(req, res);

      //then
      expect(deleteStub.calledOnce).to.be.true;
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(200);
      expect(send.calledOnce).to.be.true;
      expect(send.args[0][0]).to.eql(message);
    });

    it("should delete all orders", async function () {

      //given
      const message = "All orders cleared successfully";

      deleteAllStub.returns(Promise.resolve(message));

      //when
      await OrderController.deleteAll(req, res);

      //then
      expect(deleteAllStub.calledOnce).to.be.true;
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(200);
      expect(send.calledOnce).to.be.true;
      expect(send.args[0][0]).to.eql(message);
    });


    //yields method
    it("should return not found message when orderid not found with yields", async function () {

      //given
      req = { params: { orderId: 2 } };

     const result = { kind: "not_found" };

      const message = {
        message:`Not found Order with id`
        };

     deleteStub.yields(null,result);



      //when
      await OrderController.delete(req, res);

      //then
     expect(deleteStub.calledOnce).to.be.true;
    expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(404);
      expect(send.calledOnce).to.be.true;
     expect(send.args[0][0]).to.eql(message);
    });

    it("delete method return works", async function () {

      //given
      req = { params: { orderId: 2 } };

      const result = { kind: "not_found" };
     // const result2 = { kind: "not_found" };
     // const result2 = { kind: "not_found" };

      const message = {
        message:`Not found Order with id`
        };

     deleteStub.yields(null,result);

  
      //when
      await OrderController.delete(req, res);

      //then
      expect(deleteStub.calledOnce).to.be.true;
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(404);
      expect(send.calledOnce).to.be.true;
      expect(send.args[0][0]).to.eql(message);
    });

    it("callArg works", async function () {
   
      //given
      req = { params: { orderId: 2 } };

      const result = { kind: "not_found" };

      const message = {
        message:`Not found Order with id`
        };

       // deleteStub.callsArgWith(1,null, result)

        deleteStub.callsArgWith(2,result, null)

  //when
  await OrderController.delete(req, res);

  console.log(send.args[0][0]);

  //then
 expect(deleteStub.calledOnce).to.be.true;
expect(status.calledOnce).to.be.true;
  expect(status.args[0][0]).to.equal(404);
  expect(send.calledOnce).to.be.true;
 expect(send.args[0][0]).to.eql(message);






    });

 

    afterEach(() => {
      deleteStub.restore();
      deleteAllStub.restore();
    });
  });
});
