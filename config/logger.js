//Config
module.exports = {
	path: '/opt/mean/logs/',
	format: {
		access: ':remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] :referrer :user-agent'
	}
}