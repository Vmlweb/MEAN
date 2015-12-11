var https = require('https');
var http = require('http');
var fs = require('fs');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();

//Config
var listenConfig = require(path.join(__dirname, 'config', 'listen.conf'));

//Favicon
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//Logging
app.use(morgan('combined'));

//Request Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//Static Routes
app.use(express.static(path.join(__dirname, 'public')));
app.use('/libs', express.static(path.join(__dirname, 'libs')));

//HTTP Listen
if (listenConfig.http.hostname != ''){
	http.createServer(app).listen(listenConfig.http.port, listenConfig.http.hostname);
	console.log('HTTP listening at ' + listenConfig.http.hostname + ':' + listenConfig.http.port);
}

//HTTPS Listen
if (listenConfig.https.hostname != ''){
	https.createServer({
		key: fs.readFileSync(listenConfig.https.ssl.key),
		cert: fs.readFileSync(listenConfig.https.ssl.cert)
	}, app).listen(listenConfig.https.port, listenConfig);
	console.log('HTTPS listening at ' + listenConfig.https.hostname + ':' + listenConfig.https.port);
}