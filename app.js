//Modules
var path = require('path');
var async = require('async');
var recursive = require('recursive-readdir');

//Setup
var logger = require('./app/logger.js');
var mongo = require('./app/mongo.js');
var express = require('./app/express.js');

//Load APIs
recursive('./api/', function (err, files) {
	for (var i=0; i<files.length; i++){
		express.app.use('/api', require('./' + files[i]));
	}
});

log.info('Setup request routers for APIs');
log.info('Ready for connections...');

//Graceful shutdown
var shutdown = function() {
	log.info("Shutting down gracefully...");
	
	//Run all shutdown tasks in series
	async.series([
	    function(done){
		    
		    //Database
		    mongo.close(function(){
		    	done(null);
		    });
		    
	    },
	    function(done){
		    
		    //HTTP
		    if (express.hasOwnProperty('http')){
			    express.http.close(function(){
			    	done(null);
			    });
		    }else{
			    done(null);
			}
		    
	    },
	    function(done){
		    
		    //HTTPS
		    if (express.hasOwnProperty('https')){
			    express.https.close(function(){
			    	done(null);
			    });
		    }else{
			    done(null);
			}
	    }
	], function(error){
		
		//Exit with or without error
		if (error){
			log.error(error);
			process.exit(1);
		}else{
			process.exit();
		}
	});
	
	//Shutdown timeout after 4 seconds
	setTimeout(function() {
		log.error("Shutdown timed out, force quitting");
		process.exit();
	}, 4000);
}

//Intercept kill and end signals
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);