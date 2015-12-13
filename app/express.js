var https = require('https');
var http = require('http');
var fs = require('fs');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var listenConfig = require(path.join(__dirname, '../','config', 'listen.js'));
var loggingConfig = require(path.join(__dirname, '../','config', 'logging.js'));
var express = require('express');
var app = express();
module.exports = {}

//Favicon
//express.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//Attach access logging to express
app.use(require("morgan")(loggingConfig.access.format, { "stream": log.stream }));

//Request Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

log.info('Express initialized');

//Static Routes
app.use(express.static(path.join(__dirname, '../', 'public')));
app.use('/libs', express.static(path.join(__dirname, '../', 'libs')));

log.info('Static routes created');

//HTTP Listen
if (listenConfig.http.hostname != ''){
	module.exports.http = http.createServer(app).listen(listenConfig.http.port, listenConfig.http.hostname);
	
	//Closing HTTP
	module.exports.http.on('close', function(){
		log.info('HTTP server ended and stream closed');
	});
	log.info('HTTP listening at ' + listenConfig.http.hostname + ':' + listenConfig.http.port);
}

//HTTPS Listen
if (listenConfig.https.hostname != ''){
	module.exports.https = https.createServer({
		key: listenConfig.https.ssl.key,
		cert: listenConfig.https.ssl.cert
	}, app).listen(listenConfig.https.port, listenConfig.https.hostname);
	
	//Closing HTTPS
	module.exports.https.on('close', function(){
		log.info('HTTPS server ended and stream closed');
	});
	log.info('HTTPS listening at ' + listenConfig.https.hostname + ':' + listenConfig.https.port);
}

module.exports.app = app;