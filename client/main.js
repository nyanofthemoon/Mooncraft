'use strict';

var express = require('express');

var logger = new (require('./../server/modules/logger'))('CLIENT');

var config = require('./config');
var port   = config.environment.port;

var app     = express();
var options = {
    dotfiles  : 'ignore',
    etag      : false,
    extensions: ['htm', 'html'],
    index     : 'index.html',
    maxAge    : '1d',
    redirect  : false,
    setHeaders: function (res, path, stat) {
        res.set('x-timestamp', Date.now());
    }
};

app.use(express.static('client/public', options));

app.listen(port, function () {
    logger.info('Listening on port ' + port);
});