//Modules
var url = require('url');
var fs = require('fs-extra');
var request = require('request');
var should = require('should'); require('should-http');
var expressConfig = require('../../config/express.js');

//Tests
describe('Web libraries', function(){
	
	//HTTP request
	it('should return time for ' + expressConfig.http.test + 'api/time', function(done){
		request({url: expressConfig.http.test + 'api/time', json: true}, function (err, res, body) {
			
			//Chec ksuccess status
			res.should.have.status(200);
			
			//Check that time matches mock objects time
			body.time.should.be.equal('Sunday, December 12th 2012, 12:12:12 am');
			
			//Check there was no error in the request
			should(err).be.null;
			
			done();
		})
	});
})