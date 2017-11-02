
const config = require('./config/index').init(process.env.NODE_ENV);

const log = require("node-logger").getLogger();

const express = require('express');
const app = express();

app.use(require('body-parser').json({
    limit: '10mb'
}));
app.use(require('body-parser').urlencoded({
    extended: true
}));

app.set('port', config.port);



const env = require('./scripts/env/index');
env.init(config, function (error) {
    if (!error) {
        log.debug('init env success !');
        start();
    }
    log.error(error);
});


function start() {
    app.get('/', function (req, res){
        res.type('text/plain');
        res.status(200);
        res.end('welcome to dwz server ...');
    });

    const routes = require('./scripts/router');
    app.use('/', routes);

    app.use(function(req, res) {
        res.type('text/plain');
        res.status(404);
        res.send('404 - NOT FOUND');
    });

    app.listen(app.get('port'), function() {
        var nowDate = new Date();
        console.log('e-contract started on port ' + app.get('port') + ' @' + nowDate.toLocaleDateString() + ' ' +
            nowDate.toLocaleTimeString());
    });
}






