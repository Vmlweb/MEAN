var path = require('path');
var fs = require('fs-extra');
var morgan = require('morgan');
var moment = require('moment');
var winston = require('winston');
var winstonRotate = require('winston-daily-rotate-file');
var app = require('express')();
var config = require(path.join(__dirname, '../', 'config', 'logging.js'));

//Check and create logs directories
var errorPath = path.join(__dirname, '../', config.directory.error);
if (!fs.ensureDirSync(errorPath)){
	fs.mkdirsSync(errorPath);
}
var infoPath = path.join(__dirname, '../', config.directory.info);
if (!fs.ensureDirSync(infoPath)){
	fs.mkdirsSync(infoPath);
}
var accessPath = path.join(__dirname, '../', config.directory.access);
if (!fs.ensureDirSync(accessPath)){
	fs.mkdirsSync(accessPath);
}

//Configure output formatter
var formatter = function(options){
	var format = '(' + moment().format() + ') '
    format += '[' + winston.config.colorize(options.level,options.level.toUpperCase()) + '] ';
    format += options.message;
    if (options.meta.length > 0){
        format += JSON.stringify(options.meta);
    }
    return format;
}

//Setup winston logger and stream transports
var logger = new winston.Logger({
    transports: [
	    new winstonRotate({
		    name: 'error',
		    level: 'error',
		    filename: path.join(errorPath, 'error.json'),
		    datePattern: '.yyyy-MM-dd',
            json: true,
            colorize: false,
	    }),
	    new winstonRotate({
		    name: 'info',
		    level: 'info',
		    filename: path.join(infoPath, 'info.json'),
		    datePattern: '.yyyy-MM-dd',
            json: true,
            colorize: false,
        }),
	    new winstonRotate({
		    name: 'verbose',
		    level: 'verbose',
		    filename: path.join(accessPath, 'access.json'),
		    datePattern: '.yyyy-MM-dd',
            json: true,
            colorize: false,
        }),
        new winston.transports.Console({
		    name: 'console',
            level: 'silly',
            json: false,
            colorize: true,
            formatter: formatter
        })
    ],
    exitOnError: false
});

//Globalize new logger
log = {};
log.stream = {
	write: function(message, encoding){
        logger.verbose(message);
    }
}
log.error = logger.error;
log.warn = logger.warn;
log.info = logger.info;
log.verbose = logger.verbose;
log.debug = logger.debug;
log.silly = logger.silly;

//Tell the world it's so!
log.info('Logger initialized');

module.exports = logger;