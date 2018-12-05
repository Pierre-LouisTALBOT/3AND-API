/**
 * MySQL configuration
 */
var mysql = require('mysql');
var logger = require('./logger.js');
const pool = mysql.createPool({
	connectionLimit: 10,
	host: 'localhost',
	user: 'root',
	password: 'azertyuiop',
	database: '3and_api'
});

function select(sql, args, callback) {
	if (!callback) {
		queryDatabase(sql, null, args);
	} else {
		queryDatabase(sql, args, callback);
	}
}

function query(sql, args, callback) {
	queryDatabase(sql, args, callback);
}

module.exports = {
	select,
	query
};

function queryDatabase(sql, args, callback) {
	if (!callback) {
		return;
	}

	pool.getConnection((err, connection) => {
		if (err) {
			handleError(sql, err, callback);
			return;
		}

		connection.query(sql, args, (error, results) => {
			connection.release();

			if (error) {
				handleError(sql, error, callback);
				return;
			}

			try {
				var objs = [];
				for (var i = 0; i < results.length; i++) {
					objs.push(results[i]);
				}

				callback(null, objs);
			} catch (e) {
				handleError(sql, e, callback);
				return;
			}
		});
	});
}

function handleError(sql, err, callback) {
	logger.log('error', 'Error in MySQL', {
		'sql': sql
	});
	callback(err, null);
}
