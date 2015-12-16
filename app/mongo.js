//Modules
var path = require('path');
var mongoose = require('mongoose');

//Configs
var mongoConfig = require(path.join(__dirname, '../','config', 'mongo.js'));

//Connect to database
var url = mongoConfig.connection.hostname + ':' + mongoConfig.connection.port + '/' + mongoConfig.connection.database;
mongoose.connect('mongodb://' + mongoConfig.connection.user + ':' + mongoConfig.connection.password + '@' + url);

//Database events
mongoose.connection.on('error', function(error){
	log.error('Error connecting to database at ' + url);
});
mongoose.connection.once('open', function(){
	log.info('Connected to database at ' + url);
});
mongoose.connection.on('close', function(){
	log.info('Database connection ended and stream closed');
});

module.exports = mongoose;