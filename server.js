/**
 * External Module dependencies.
 */

const express = require('express');
const app = express();
const server = require('http').createServer(app);

/**
 * Internal Module dependencies.
 */

const logger = require('./logger.js');
const expressRoutes = require('./routes.js');

/**
 * Configure Express routes and uses
 */

expressRoutes.init(express, app);

/**
 * Start listen with the server
 */

const port = 80;
server.listen(port, () => logger.log('info', 'Express server listening on port ' + port + ', in ' + app.get('env') + ' mode'));
