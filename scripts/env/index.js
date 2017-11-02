const redis = require('./redis');
const db = require('./db');


function init(config, callback) {
    redis.init(config.redis)
        .then(function () {
            return db.init(config.db)

        })
        .then(function () {
            callback(null);
        })
        .catch(function(e) {
            callback(e);
        });
}

function getRedisClient() {
    return redis.getClient();
}

function getDbClient() {
    return db.getClient();
}

function getDbClientS() {
    return db.getClientS();
}

module.exports = {
    init: init,
    getRedisClient: getRedisClient,
    getDbClient: getDbClient,
    getDbClientS: getDbClientS
};