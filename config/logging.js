module.exports = {
	directory: {
		error: '/logs/error/',
		info: '/logs/info/',
		access: '/logs/access/'
	},
	access_format: ':remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] :referrer :user-agent'
}