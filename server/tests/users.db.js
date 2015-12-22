//Modules
var async = require('async');

//Classes
var User = require('../models/user.js');

//Setup
beforeEach(function(callback){
		
	//Reset the databases
	User.remove(function(){
		var objects = [];

		//Add new users to database
		objects.push(User({ username: 'FirstUser', password: "firstUserPassword" }));
		objects.push(User({ username: 'SecondUser', password: "secondUserPassword" }));
		objects.push(User({ username: 'ThirdUser', password: "thirdUserPassword" }));
		
		//Save all objects to database
		async.each(objects, function (obj, done) {
			obj.save(function(err){
				done();
			});
		}, function(){
			callback();
		});
	});
});