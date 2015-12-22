//Modules
var url = require('url');
var fs = require('fs-extra');
var request = require('request');
var expect = require('chai').expect;

//App
var expressConfig = require('../config/express.js');

//Perform tests
describe('Time', function(){
	
	//HTTP request
	it('should return stub time for /api/time', function(done){
		request({url: expressConfig.http.test + 'api/time', json: true}, function (err, res, body) {
			
			//Chec success status and error
			expect(res.statusCode).to.equal(200);
			expect(err).to.be.null;
			
			//Check that time matches mock objects time
			expect(body.time).to.equal('Sunday, December 12th 2012, 12:12:12 am');
			
			done();
		})
	});
})