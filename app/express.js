var https = require('https');
var http = require('http');
var fs = require('fs');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require(path.join(__dirname, '../','config', 'listen.js'));
var express = require('express');
var app = express();

//Favicon
//express.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//Attach access logging to express
app.use(require("morgan")(':remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] :referrer :user-agent', { "stream": log.stream }));

//Request Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

log.info('Express initialized');

//Static Routes
app.use(express.static(path.join(__dirname, '../', 'public')));
app.use('/libs', express.static(path.join(__dirname, '../', 'libs')));

log.info('Static routes configured');

//HTTP Listen
if (config.http.hostname != ''){
	http.createServer(app).listen(config.http.port, config.http.hostname);
	log.info('HTTP listening at ' + config.http.hostname + ':' + config.http.port);
}

//HTTPS Listen
if (config.https.hostname != ''){
	https.createServer({
		key: fs.readFileSync(config.https.ssl.key),
		cert: fs.readFileSync(config.https.ssl.cert)
	}, app).listen(config.https.port, config.https.hostname);
	log.info('HTTPS listening at ' + config.https.hostname + ':' + config.https.port);
}

module.exports = app;