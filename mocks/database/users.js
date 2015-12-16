//Modules
var async = require('async');

//Classes
var User = require('../../app/models/user.js');

//Setup
beforeEach(function(callback){
		
	//Reset users database
	var users = [];
	User.remove(function(){
	
		//Add new users to database
		users.push(User({ username: 'FirstUser', email: 'FirstUser@FirstUser.com', password: "firstUserPassword" }));
		users.push(User({ username: 'SecondUser', email: 'SecondUser@SecondUser.com', password: "secondUserPassword" }));
		users.push(User({ username: 'ThirdUser', email: 'ThirdUser@ThirdUser.com', password: "thirdUserPassword" }));
		users.push(User({ username: 'FourthUser', email: 'FourthUser@FourthUser.com', password: "fourthUserPassword" }));
		
		//Save list of users
		async.each(users, function (obj, done) {
			obj.save(function(err){
				done();
			});
		}, function(err){
			callback();
		});
	})
		
});