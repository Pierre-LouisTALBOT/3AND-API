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

/**
 * Public functions
 */
exports.init = function (express, app) {
    app.use(session({
        secret: 'work hard',
        resave: true,
        saveUninitialized: false
    }));
    app.use(express.json());
    app.use(logRequest);
    app.use(compression({
        threshold: '50kb' // only compress if size is above this threshold
    }));
    app.use(minify({
        uglifyJsModule: uglifyEs
    }));

    initRoutes(app);

    app.use(notFoundHandler);
    app.use(errorHandler);
};

/**
 * Private functions
 */

function logRequest(req, res, next) {
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
    res.status(404).json({
        'code': 404,
        'message': 'API not found'
    });
}

function errorHandler(err, req, res, next) {
    logger.log('error', 'Internal server error', getInfos(req, null, err));

    if (res.headersSent) {
        return next(err);
    }
    res.status(500).json({
        'code': 500,
        'message': 'Internal server error'
    });
}

function getInfos(req, res, err) {
    let infos = {};

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

const co = require('./coffee.js');

function initRoutes(app) {
    app.get('/', function (req, res) {
        res.sendFile(path.resolve(__dirname + '/index.html'));
    });

    app.get('/init', function (req, res) {
        db.initDB();
        res.json({
            message: 'Database initiated'
        });
    });

    // Get all coffees
    app.get('/coffee', function (req, res) {
        res.json(co.getAll());
    });

    // Get a coffee by ID
    app.get('/coffee/:id', function (req, res) {
        res.json(co.get(req.params.id));
    });

    // Add a coffee
    app.post('/coffee', (req, res) => {
        res.json(co.add(req.body.name, req.body.type, req.body.country, req.body.comments, req.body.rating));
    });

    // Update a coffee
    app.put('/coffee/:id', (req, res) => {
        res.json(co.update(req.body.id, req.body.name, req.body.type, req.body.country, req.body.comments, req.body.rating));
    });

    // Delete a coffee
    app.delete('/coffee/:id', (req, res) => {
        res.json(co.delete(req.params.id));
    });
}
