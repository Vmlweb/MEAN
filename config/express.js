//Modules
var path = require('path');
var fs = require('fs');

//Load SSL certificates for HTTPS
var keyPath = path.join(__dirname, 'ssl', 'key.pem');
var certPath = path.join(__dirname, 'ssl', 'cert.pem');
var key = '';
var cert = '';
if (fs.existsSync(keyPath) && fs.existsSync(certPath)){
	key = fs.readFileSync(keyPath);
	cert = fs.readFileSync(certPath);
}

//Config
module.exports = {
	http: {
		hostname: '0.0.0.0',
		port: '8080',
		test: 'http://test.vmlweb.co.uk/'
	},
	https: {
		hostname: '0.0.0.0',
		port: '4434',
		ssl: {
			key: key,
			cert: cert
		},
		test: 'https://test.vmlweb.co.uk/'
	}
}