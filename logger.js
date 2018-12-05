const winston = require('winston');

// maxLogFileSize: it's in bytes ; so here's 100Mo
const maxLogFileSize = 100 * 1024 * 1024;
// Max files created for logs
const maxFiles = 5;

const logFormat = winston.format.printf(info => {
	const base = {
		timestamp: new Date()
	};
	info = Object.assign(base, info);
	return JSON.stringify(formatLog(info)) + ',';
});

const logger = winston.createLogger({
	format: winston.format.combine(logFormat),
	transports: [new winston.transports.File({filename: 'logs/nodejs-log.json', maxsize: maxLogFileSize, maxFiles: maxFiles, level: 'info', json: true})],
	exitOnError: false
});

if (process.env.NODE_ENV !== 'production') {
	logger.add(new winston.transports.Console({'level': 'debug'}));
}

function formatLog(obj) {
	const objKeys = ['timestamp', 'token', 'level', 'message'];
	var res = {};

	for (var k of objKeys) {
		if (obj[k]) {
			res[k] = obj[k];
			delete obj[k];
		}
	}

	for (k in obj) {
		res[k] = obj[k];
	}

	return res;
}

module.exports = logger;
