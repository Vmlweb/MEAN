//Modules
var async = require('async');

module.exports = function(done){
	
	//Mock users database
	var User = require('../app/models/user.js');
	var users = [
		{ username: 'FirstUser', email: 'FirstUser@FirstUser.com', password: "firstUserPassword" },
		{ username: 'SecondUser', email: "SecondUser@SecondUser.com", password: "secondUserPassword" },
		{ username: 'ThirdUser', email: 'ThirdUser@ThirdUser.com', password: "thirdUserPassword" },
		{ username: 'FourthUser', email: 'FourthUser@FourthUser.com', password: "fourthUserPassword" },
	];
	
	//Start async operation
	async.eachSeries(users, function(obj, next){
		var user = new User(obj);
		user.save(function(){
			next();
		});
	}, function(){
		log.info('Added mock users to database');
		done();
	});
}