//Config
module.exports = {
	path: '/opt/mean/data/',
	connection: {
		user: 'mean',
		password: 'mean',
		hostname: process.env.MONGO_PORT_27017_TCP_ADDR || '127.0.0.1',
		port: 27017,
		database: 'mean'
	}
}