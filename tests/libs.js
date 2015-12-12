var fs = require('fs-extra');
var request = require('request');
var should = require('should');
var shouldHttp = require('should-http');
var urls = require('../config/listen.js').tests;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; //Ignore insecure ssl certificates

describe('Web libraries', function(){
	
	//List of files which should exist inside the libs folder
	var libFiles = [
		'angular.min.js',
		'angular.min.js.map',
		'angular-route.min.js',
		'angular-route.min.js.map',
		'jquery.min.js',
		'jquery.min.map',
		'semantic.min.css',
		'semantic.min.js'
	];
	
	//Create test for each file
	libFiles.forEach(function(file){
		
		var filePath = 'libs/' + file;
		
		//HTTP request
		it('should return http 200 status for ' + urls.http + filePath, function(done){
			request(urls.http + filePath, function (err, res, body) {
				
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
		
		//HTTPS request
		it('should return https 200 status for ' + urls.https + filePath, function(done){
			request(urls.https + filePath, function (err, res, body) {
				
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