module.exports = {
	error: {
		dirname: '/logs/error/'
	},
	info: {
		dirname: '/logs/info/'
	},
	access: {
		dirname: '/logs/access/',
		format: ':remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] :referrer :user-agent'
	},
}