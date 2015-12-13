//Setup
var logger = require('./app/logger.js');
var express = require('./app/express.js');

//HTTP and HTTPS Shutdown Procedures
var httpShutdown = function(){
	if (express.hasOwnProperty('http')){
		express.http.close(function() {
			httpsShutdown();
		});
	}else{
		httpsShutdown();
	}
}
var httpsShutdown = function(){
	if (express.hasOwnProperty('https')){
		express.https.close(function() {
			process.exit();
		});
	}else{
		process.exit();
	}
}

//Graceful Shutdown
var startShutdown = function() {
	log.info("Shutting down gracefully");
	httpShutdown();
	
	//Shutdown timeout after 4 seconds
	setTimeout(function() {
		log.error("Shutdown timed out, force quitting");
		process.exit();
	}, 4000);
}

//Intercept kill signals
process.on('SIGTERM', startShutdown);
process.on('SIGINT', startShutdown);