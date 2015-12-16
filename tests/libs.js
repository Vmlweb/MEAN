//Modules
var url = require('url');
var fs = require('fs-extra');
var request = require('request');
var should = require('should'); require('should-http');
var expressConfig = require('../config/express.js');

//Tests
describe('Web libraries', function(){
	
	//List of files which should exist inside the libs folder
	var libFiles = [
		'angular.min.js',
		'angular.min.js.map',
		'angular-ui-router.min.js',
		'jquery.min.js',
		'jquery.min.map',
		'semantic.min.css',
		'semantic.min.js'
	];
	
	//Create test for each file
	libFiles.forEach(function(file){
		var filePath = 'libs/' + file;
		
		//HTTP request
		it('should return http 200 status for ' + expressConfig.http.test + filePath, function(done){
			request(expressConfig.http.test + filePath, function (err, res, body) {
				
				//Check the status and content length is correct to local version
				res.should.have.status(200);
				res.should.have.header('Content-Length', fs.statSync(filePath)['size'].toString());
				
				//Check that body matches local version
				body.should.be.equal(fs.readFileSync(filePath).toString());
				
				//Check there was no error in the request
				should(err).be.null;
				
				done();
			})
		});
	});
})