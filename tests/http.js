var request = require('request');
var should = require('should');

describe('Server Test', function(){
	it('should return http 200 status', function(done){
		
		request('http://localhost:1234/', function (error, response, body) {
			
			should.equal(response.statusCode, 200);
			should.equal(error, null);
			
			done();
		})
		
	})
})