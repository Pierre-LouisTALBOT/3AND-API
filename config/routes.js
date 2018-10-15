/**
 * Express Route configuration
 */

/**
  * External Module dependencies.
  */

const uuid = require('uuid/v4');
const path = require('path');
const session = require('express-session');
const bodyparser = require('body-parser');
const minify = require('express-minify');
const uglifyEs = require('uglify-es');
const compression = require('compression');
const logger = require('./logger.js');
const db = require('./database.js');

const webdir = path.resolve(__dirname + '/../www/');

/**
 * Public functions
 */
exports.init = function(express, app) {
	app.use(session({secret: 'work hard', resave: true, saveUninitialized: false}));
	app.use(bodyparser.urlencoded({extended: false}));
	app.use(logRequest);
	app.use(compression({
		threshold: '50kb' // only compress if size is above this threshold
	}));
	app.use(minify({uglifyJsModule: uglifyEs}));

	app.use('/ressources', express.static(webdir + '/ressources/css'));
	app.use('/ressources', express.static(webdir + '/ressources/scripts'));
	app.use('/ressources', express.static(webdir + '/ressources/scripts/bundles'));

	app.use('/ressources', express.static(webdir + '/pages/julien/Julien-Daviaud-Demaille_files'));

	initRoutes(app);

	app.use(notFoundHandler);
	app.use(errorHandler);
};

/**
 * Private functions
 */

function logRequest(req, res, next) {
	// TODO: For express metrics, see https://www.npmjs.com/package/express-metrics
	const requestStartTime = new Date();
	req.requestId = uuid().substring(0, 8);
	logger.log('info', 'Called url', getInfos(req));

	const cleanup = () => {
		res.removeListener('finish', logFinish);
		res.removeListener('close', logClose);
	};

	const logFinish = () => {
		cleanup();
		res.responseTime = Math.abs(new Date() - requestStartTime);
		logger.log(getLoggerForStatusCode(res.statusCode), 'Finished url', getInfos(req, res));
	};

	const logClose = () => {
		cleanup();
		res.responseTime = Math.abs(new Date() - requestStartTime);
		logger.log('warn', 'Request aborted by the client', getInfos(req, res));
	};

	res.on('finish', logFinish); // successful request (regardless of its response)
	res.on('close', logClose); // aborted request

	next();
}

function getLoggerForStatusCode(code) {
	if (code >= 500) {
		return 'error';
	}
	if (code >= 400) {
		return 'warn';
	}

	return 'info';
}

function notFoundHandler(req, res, next) {
	if (res.headersSent) {
		return next();
	}
	res.status(404).sendFile(webdir + '/pages/error/404.html');
}

function errorHandler(err, req, res, next) {
	logger.log('error', 'Internal server error', getInfos(req, null, err));

	if (res.headersSent) {
		return next(err);
	}
	res.status(500).sendFile(webdir + '/pages/error/500.html');
}

function getInfos(req, res, err) {
	var infos = {};

	if (req) {
		infos = {
			'token': req.requestId,
			'url': req.originalUrl,
			'remoteIp': req.connection.remoteAddress
		};
	}
	if (res) {
		infos.responseTime = res.responseTime;
		infos.statusCode = res.statusCode;
		infos.statusMessage = res.statusMessage;
	}
	if (err) {
		infos.error = err.stack;
	}

	return infos;
}

function initRoutes(app) {
	app.get('/', function(req, res) {
		res.sendFile(webdir + '/pages/index.html');
	});

	app.get('/login', function(req, res) {
		res.sendFile(webdir + '/pages/login/login.html');
	});

	app.get('/api/test', function(req, res) {
		res.json({
			'posts': ['test titre', 'titre 2']
		});
	});

	app.get('/db/select', (req, res, next) => {
		db.select('SELECT * FROM users LIMIT 1000', (err, objs) => {
			if (err) {
				next(err);
				return;
			}
			res.json(objs);
		});
	});

	app.get('/db/select/:username', (req, res, next) => {
		db.select('SELECT * FROM users WHERE username = ?', req.params.username, (err, objs) => {
			if (err) {
				next(err);
				return;
			}
			res.json(objs);
		});
	});

	app.get('/db/insert', (req, res, next) => {
		db.query('INSERT users(username, password) values(?, ?)', [
			'test', 'test'
		], (err, objs) => {
			if (err) {
				next(err);
				return;
			}
			res.json(objs);
		});
	});

	app.get('/500', function() {
		throw new Error('test');
	});

	app.get('/julien', function(req, res) {
			res.sendFile(webdir + '/pages/julien/Julien-Daviaud-Demaille.html');
	});
}
