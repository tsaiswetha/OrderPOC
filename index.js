var express = require('express');
var app = express();

//var router = express.Router();

var bodyParser = require('body-parser');
app.use(bodyParser.json())

const db = require('./app/config/db.config.js');

require('./app/route/order.route.js')(app);

// Create a Server
var server = app.listen(8083, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  
  console.log("App listening at http://%s:%s", host, port)
})