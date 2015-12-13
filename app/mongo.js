//Modules
var path = require('path');
var mongoose = require('mongoose');

//Configs
var mongoConfig = require(path.join(__dirname, '../','config', 'mongo.js'));

//Connect to database
mongoose.connect('mongodb://' + mongoConfig.connection.hostname + ':' + mongoConfig.connection.port + '/' + mongoConfig.connection.database);
var mongo = mongoose.connection;

//Database events
mongo.on('error', function(error){
	log.error(error);
});
mongo.once('open', function(){
	log.info('Connected to database at ' + mongoConfig.connection.hostname + ':' + mongoConfig.connection.port + '/' + mongoConfig.connection.database);
});

module.exports = mongo;