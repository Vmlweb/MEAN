//Modules
var https = require('https');
var http = require('http');
var fs = require('fs');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var recursive = require('recursive-readdir');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var compression = require('compression');
var express = require('express');
var app = express();
module.exports = { app: app }

//Configs
var expressConfig = require(path.join(__dirname, '../','config', 'express.js'));
var loggerConfig = require(path.join(__dirname, '../','config', 'logger.js'));

log.info('Express initialized');

//Favicon
//express.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//Attach access logging to express
app.use(require("morgan")(loggerConfig.format.access, { "stream": log.stream }));

//Request Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(compression());

log.info('Middleware attached');

//HTTP Listen
if (expressConfig.http.hostname != ''){
	
	//Create server and listen
	module.exports.http = http.createServer(app).listen(expressConfig.http.port, expressConfig.http.hostname);
	
	//Logging for events
	module.exports.http.on('close', function(){
		log.info('HTTP server ended and stream closed');
	});
	log.info('HTTP listening at ' + expressConfig.http.hostname + ':' + expressConfig.http.port);
}

//HTTPS Listen
if (expressConfig.https.hostname != '' && expressConfig.https.ssl.key != '' && expressConfig.https.ssl.cert != ''){
	
	//Create server and listen
	module.exports.https = https.createServer({
		key: expressConfig.https.ssl.key,
		cert: expressConfig.https.ssl.cert
	}, app).listen(expressConfig.https.port, expressConfig.https.hostname);
	
	//Logging for events
	module.exports.https.on('close', function(){
		log.info('HTTPS server ended and stream closed');
	});
	log.info('HTTPS listening at ' + expressConfig.https.hostname + ':' + expressConfig.https.port);
}

//Static routes for web frameworks
app.use(express.static(path.join(__dirname, '../', 'public')));
app.use('/libs', express.static(path.join(__dirname, '../', 'libs')));
app.use('/errors', express.static(path.join(__dirname, '../', 'src', 'errors')));

log.info('Static routes created');

//Load api calls from file
recursive('./api/', function (err, files) {
	
	//Routing handler for api calls
	if (err){
		log.error(err.message);	
	}else{
		
		//Import individual api routers
		for (var i=0; i<files.length; i++){
			var route = require('../' + files[i]);
			app.use('/api', route);
		}
	}
	
	log.info('Setup request routes for apis');
	
	//Error handler for server side api requests
	app.use('/api', function(req, res, next){
		res.status(404).json({ error: 'Not Found' });
	});
	app.use('/api', function(err, req, res, next){
		if (isString(err)){
			res.status(200).json({ error: err });
		}else{
			log.error(err.stack || err);
			res.status(500).json({ error: 'Server error, contact administrator' });
		}
	});
	
	//Error handler for client side requests
	app.use(function(req, res, next){
		res.status(404).redirect('/errors/404.html');
	});
	app.use(function(err, req, res, next){
		log.error(err.stack);
		res.status(500).redirect('/errors/500.html');
	});

	log.info('Defined error handling routes');
});