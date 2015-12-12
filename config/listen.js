var path = require('path');
var fs = require('fs');

module.exports = {
	http: {
		hostname: '0.0.0.0',
		port: '80'
	},
	https: {
		hostname: '0.0.0.0',
		port: '443',
		ssl: {
			key: fs.readFileSync(path.join(__dirname, 'key.pem')),
			cert: fs.readFileSync(path.join(__dirname, 'cert.pem'))
		}
	},
	tests: {
		http: 'http://localhost/',
		https: 'https://localhost/'
	}
}