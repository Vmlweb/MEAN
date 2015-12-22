//Includes
require('../app.js');

//Setup
before(function(done){

	//Params
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; //Accept self signed ssl certificates
	
	//Wait 1.5 seconds for all to load
	setTimeout(done, 1500);
})