module.exports = {
    port: 8000,
    poolId: 1,
    headTag: 'http://127.0.0.1:8000/tf',
    redis: { // 缓存配置
        host: '127.0.0.1',
        port: '6379',
        // password: '',
        db: 1
    },
    db: {
        mysql_master: { // 数据库地址
            host: '127.0.0.1',
            port: 3306,
            user: 'root',
            password: '',
            database: 'test'
        },
        mysql_slave_1: { // 数据库从库地址
            host: '127.0.0.1',
            port: 3306,
            user: 'root',
            password: '',
            database: 'test'
        }
    }
};
