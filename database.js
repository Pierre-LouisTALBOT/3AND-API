/**
 * Created by aytsukii on 10/01/2017.
 */
/**
 * External Module dependencies.
 */
//DataBase
const low = require('lowdb');
const logger = require('./logger.js');
const FileSync = require('lowdb/adapters/FileSync')
const db = low(new FileSync('db.json'));

exports.initDB = function () {
    db.get('coffees').assign([]).write();
    logger.log('info', 'Database initiated');
};
