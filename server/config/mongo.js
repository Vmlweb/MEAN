//Config
module.exports = {
	path: '/opt/mean/data/',
	connection: {
		user: 'mean',
		password: 'mean',
		hostname: process.env.DBNAME || '127.0.0.1',
		port: 27017,
		database: 'mean'
	}
}