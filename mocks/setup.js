//App
var logger = require('../app/logger.js');
var mongo = require('../app/mongo.js');

//Params
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; //Accept self signed ssl certificates