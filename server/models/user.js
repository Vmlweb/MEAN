//Modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
module.exports = {}

//Schema
var schema = new Schema({
	username: String,
	password: String
});

//Model
module.exports = mongoose.model('Users', schema);