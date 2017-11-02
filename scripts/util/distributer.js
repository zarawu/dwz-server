/**
 * 分号器：一个自增的分号器
 */

const env = require('../env/index');

const DISTRIBUTERHEAD = 'DISTRIBUTER_';
const SHORT_RUL_HEAD = 'SHORTURL_';
const LONG_RUL_HEAD = 'LONGURL_';

var redisClient = env.getRedisClient();
var dbClientM = env.getDbClient();
var dbClientS = env.getDbClientS();

module.exports = {
    transfShortUrl: transfShortUrl,
    getLongUrlByShort: getLongUrlByShort
};

/**
 * 长连接转换为短链接
 * @param poolId
 * @param head 'ecwz'
 * @param longUrl
 * step1: 查询redis中是否存有该长链接【有效期为2天】,有直接返回对应短链接
 * step2: 生成短链接，保存在redis中【SHORT_RUL_HEAD有效期2天,LONG_RUL_HEAD有效期2天】,保存在db中
 */



function transfShortUrl(poolId, head, longUrl) {

    return new Promise(function (resolve, reject){
        getShortUrlByLong(longUrl).then(function (shortUrl) {
            return resolve(shortUrl);
        })
        .catch(function (error) {
            if (error == '没有该长链接') { // 未存储过这个长链接
                getIndex(poolId).then(function (index) {
                    var randomStr = getRandomStr();
                    var shortUrl = head + '/'+ poolId + '/'+ randomStr + '/' + index;
                    // 保存两天
                    return redisClient.setexAsync(SHORT_RUL_HEAD + shortUrl, 60*60*24*2 ,longUrl)
                        .then(function() {
                            // 放30天，30天后重复的长地址使用不同的短链接
                            return redisClient.setexAsync(LONG_RUL_HEAD + longUrl, 60*60*24*2 ,shortUrl);
                        })
                        .then(function (res) {
                            var sql = 'INSERT INTO  shorturl_' + poolId + ' (long_url, head, short_index, random_str) values (?,?,?,?)';
                            return dbClientM.queryAsync(sql, [longUrl, head, index, randomStr]);
                        })
                        .then(function() {
                            return resolve(shortUrl);
                        })

                })
                .catch(function (error) {
                    return reject(error);
                })
            } else {
                return reject(error);
            }
        });

    });
}

/**
 * 根据短链接查寻出长链接
 * step1: find from redis ，and update ex time
 * step2: find from db
 * @param shortUrl
 */
function getLongUrlByShort (head, poolId, random, index) {
    return new Promise(function (resolve, reject){
        var shortUrl = head + '/'+ poolId + '/'+ random + '/' + index;

        redisClient.getAsync(SHORT_RUL_HEAD + shortUrl)
            .then(function(res){
                if (res) {
                    return redisClient.setexAsync(SHORT_RUL_HEAD + shortUrl, 60*60*24*2 ,res).then(function () {
                        return resolve(res);
                    });
                } else {
                    var sql = 'SELECT long_url FROM shorturl_' + poolId + ' WHERE short_index = ?';

                    return dbClientS.queryAsync(sql, [index]).then(function (dbResult) {
                        if (dbResult && dbResult.length > 0 && dbResult[0].long_url) {
                            return resolve(dbResult[0].long_url);
                        } else {
                            return reject('没有获取到长链接');
                        }
                    });
                }
            })
            .catch(function (error) {
                return reject(error);
            })
    });
}


//////////////////////////////////////////工具类/////////////////

/**
 * 根据长链接查寻出短链接
 * @param longUrl
 */
function getShortUrlByLong (longUrl) {
    return new Promise(function (resolve, reject){
        redisClient.getAsync(LONG_RUL_HEAD + longUrl)
            .then(function(res){
                if (res) {
                    return resolve(res);
                }
                return reject('没有该长链接');

            })
            .catch(function (error) {
                return reject(error);
            })
    });

}



/**
 * 获取自增号码
 * @param poolId 分号池ID
 */
function getIndex(poolId) {
    return new Promise(function (resolve, reject){

        var key =  DISTRIBUTERHEAD + poolId;
        var value = 0;
        redisClient.getAsync(key)
            .then(function(res) {
                if (!res) {
                    value = 1;
                } else {
                    value = parseInt(res) + 1;
                }
                return redisClient.setAsync(key, value)
            })
            .then(function () {
                return resolve(value);
            })
            .catch(function (error) {
                return reject(error);
            });
    });

}

/**
 * 获取随机字符串
 */
function getRandomStr() {
    //默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = chars.length;
    var pwd = '';
    for (var i = 0; i < 3; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}