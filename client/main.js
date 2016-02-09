'use strict';

const CONFIG = require('./config');

let express = require('express');

let logger = new (require('./../server/modules/logger'))('SERVER [WEB]', CONFIG);

let app     = express();
let options = {
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

let port = CONFIG.environment.port;

app.listen(port, function() {
    logger.success('Listening on port ' + port);
});