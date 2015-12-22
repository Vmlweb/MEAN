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
		test: 'http://127.0.0.1:8080/',
		url: 'http://127.0.0.1/'
	},
	https: {
		hostname: '',
		port: '',
		ssl: {
			key: key,
			cert: cert
		},
		test: '',
		url: ''
	}
}