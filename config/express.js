//Modules
var path = require('path');
var fs = require('fs');

//Load SSL certificates for HTTPS
var keyPath = path.join(__dirname, 'key.pem');
var certPath = path.join(__dirname, 'cert.pem');
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
		port: '8080'
	},
	https: {
		hostname: '0.0.0.0',
		port: '4434',
		ssl: {
			key: key,
			cert: cert
		}
	},
	tests: {
		http: 'http://127.0.0.1:8080/',
		https: 'https://127.0.0.1:4434/'
	}
}