//Modules
var async = require('async');

//Setup
var logger = require('./app/logger.js');
var express = require('./app/express.js');
var mongo = require('./app/mongo.js');

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