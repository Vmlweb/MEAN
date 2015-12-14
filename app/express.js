//Modules
var https = require('https');
var http = require('http');
var fs = require('fs');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
module.exports = { app: app }

//Configs
var expressConfig = require(path.join(__dirname, '../','config', 'express.js'));
var loggerConfig = require(path.join(__dirname, '../','config', 'logger.js'));

//Favicon
//express.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

log.info('Express initialized');

//Attach access logging to express
app.use(require("morgan")(loggerConfig.access.format, { "stream": log.stream }));

//Request Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

log.info('Middleware attached');

//Static Routes
app.use(express.static(path.join(__dirname, '../', 'public')));
app.use('/libs', express.static(path.join(__dirname, '../', 'libs')));

log.info('Static routes created');

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