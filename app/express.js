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

//Favicon
//express.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//Attach access logging to express
app.use(require("morgan")(loggingConfig.access_format, { "stream": log.stream }));

//Request Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

log.info('Express initialized');

//Static Routes
app.use(express.static(path.join(__dirname, '../', 'public')));
app.use('/libs', express.static(path.join(__dirname, '../', 'libs')));

log.info('Static routes listenConfigured');

//HTTP Listen
if (listenConfig.http.hostname != ''){
	http.createServer(app).listen(listenConfig.http.port, listenConfig.http.hostname);
	log.info('HTTP listening at ' + listenConfig.http.hostname + ':' + listenConfig.http.port);
}

//HTTPS Listen
if (listenConfig.https.hostname != ''){
	https.createServer({
		key: fs.readFileSync(listenConfig.https.ssl.key),
		cert: fs.readFileSync(listenConfig.https.ssl.cert)
	}, app).listen(listenConfig.https.port, listenConfig.https.hostname);
	log.info('HTTPS listening at ' + listenConfig.https.hostname + ':' + listenConfig.https.port);
}

module.exports = app;