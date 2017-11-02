const distributer = require('./util/distributer');
const config = require('../config/index').init(process.env.NODE_ENV);


function getShort(req, res, next) {
    const longUrl = req.body.longUrl;
    distributer.transfShortUrl(config.poolId, config.headTag, longUrl)
        .then(function (short) {
            res.json({
                error_code:0,
                resp_data: {
                    url: short
                }
            });
        })
        .catch(function (error) {
            res.json({
                error_code:1001,
                error_msg:'获取短链接失败:'+ error
            });
        })
}

function transfLong(req, res, next) {
    const poolId = req.params.pool;
    const random = req.params.random;
    const index = req.params.index;
    distributer.getLongUrlByShort(config.headTag, poolId, random, index)
        .then(function (long) {
            res.redirect(long);
        })
        .catch(function (error) {
            // 添加一个error页面
            res.type('text/plain');
            res.status(500);
            res.send('500 - meet error ' + error);
        })
}

module.exports = {
    getShort: getShort,
    transfLong: transfLong
};

