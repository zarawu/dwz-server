var redis = require('redis');
var client;
var bluebird = require('bluebird'); // TODO promise API

module.exports = {
    init: init,
    getClient: getClient,
    end: end
};

/*
 *初始化redis
 */

function init(redisConfig) {

    return new Promise(function (resolve, reject) {
        bluebird.promisifyAll(redis.RedisClient.prototype);
        bluebird.promisifyAll(redis.Multi.prototype, {suffix: "My"}); // suffixed with My

        client = redis.createClient(redisConfig);

        client.on('ready', function (res){
            return resolve();
        });

        client.on('error', function (error){
            return reject(error);
        });
    });
}


function getClient() {
    return client;
}

function end() {
    client.quit();
}

// example::
/**
 *  保存有有效期的key-value
 * @param key
 * @param seconds
 * @param value
 * @returns {*}
 */
function setEx(key, seconds, value) {
    return client.setexAsync(key, seconds, value)
}

function set(key, value) {
    return client.setAsync(key, value);
}

function get(key) {
    return client.getAsync(key);
}

/**
 * 向集合添加一个或者多个成员
 * @param key
 * @param values
 */
function sadd(key, values) {
    return client.saddAsync(key,list);
}

/**
 * 查询集合所有成员
 * @param key
 */
function smembers(key) {
    return client.smembersAsync(key);
}

/**
 * 事物
 */
function multi() {
    return client.multi().get('string key').smembers('list key').execMy();// suffixed with My
}






