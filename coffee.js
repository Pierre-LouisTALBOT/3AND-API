/**
 * Created by charles on 10/01/2017.
 */

/**
 * External Module dependencies.
 */
//DataBase
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync')
const db = low(new FileSync('db.json'));

const TABLE_NAME = 'coffees';
let idAutoincrement = 0;


exports.getAll = function () {
    return db.get(TABLE_NAME).value();
}

exports.get = function (id) {
    id = parseInt(id);
    return db.get(TABLE_NAME).find({
        id: id
    }).value();
}

exports.add = function (name, type, country, comments, rating) {
    return db.get(TABLE_NAME).push({
            id: idAutoincrement++,
            name: name,
            type: type,
            country: country,
            comments: comments,
            rating: rating
        })
        .write();
}

exports.update = function (id, name, type, country, comments, rating) {
    const modif = get(id);
    modif.name = name;
    modif.type = type;
    modif.country = country;
    modif.comments = comments;
    modif.rating = rating;

    db.get(TABLE_NAME).find({
        id: id
    }).assign(modif).write();
}

exports.delete = function (id) {
    db.get(TABLE_NAME).remove({
        id: id
    }).write();
}
