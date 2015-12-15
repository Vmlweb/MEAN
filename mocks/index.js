//Modules
var async = require('async');
var recursive = require('recursive-readdir');
var logger = require('../app/logger.js');
var mongo = require('../app/mongo.js');

//Load api calls from file
recursive('./mocks/', ['mocks/index.js'], function (err, files) {
	
	//Build list of mock functions to run 
	var mocks = [];
	for (var i=0; i<files.length; i++){
		var mock = require('../' + files)
		mocks.push(mock);
	}
	
	//Execute in series and exit
	async.series(mocks, function(){
		mongo.close(function (){
			process.exit();
		})
	})
});