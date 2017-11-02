var mysql = require('mysql');
var poolCluster;
var bluebird = require('bluebird');

module.exports = {
    init: init,
    getClient: getClient,
    getClientS: getClientS,
    end: end
};

/*
 *初始化
 */

function init(dbConfig) {
    var masterConfig = {
        host: dbConfig.mysql_master.host,
        user: dbConfig.mysql_master.user,
        password: dbConfig.mysql_master.password,
        database: dbConfig.mysql_master.database,
        connectionLimit: 10
    };

    var slave1Config = {
        host: dbConfig.mysql_slave_1.host,
        user: dbConfig.mysql_slave_1.user,
        password: dbConfig.mysql_slave_1.password,
        database: dbConfig.mysql_slave_1.database,
        connectionLimit: 10
    };
    return new Promise(function (resolve, reject) {
        try {
            poolCluster = mysql.createPoolCluster();
            poolCluster.add('MASTER', masterConfig); // add a named configuration
            poolCluster.add('SLAVE1', slave1Config);
            return resolve();
        } catch (e) {
            return reject(e);
        }
    });
}

function getClientS() {
    var pool =  poolCluster.of('SLAVE*', 'RANDOM');
    bluebird.promisifyAll(pool);
    return pool;
}

function getClient() {
    var pool = poolCluster.of('MASTER');
    bluebird.promisifyAll(pool);
    return pool;
}

function end () {
    poolCluster.end();
}