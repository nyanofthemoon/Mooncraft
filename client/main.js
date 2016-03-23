'use strict';

const CONFIG = require('./config');

let express = require('express');
var auth    = require('http-auth');

let logger = new (require('./../server/modules/logger'))('SERVER [WEB]', CONFIG);

let options = {
    dotfiles  : 'ignore',
    etag      : false,
    extensions: ['htm', 'html'],
    index     : 'index.html',
    maxAge    : '1d',
    redirect  : true,
    setHeaders: function (res, path, stat) {
        res.set('x-timestamp', Date.now());
    }
};

var basic = auth.basic({
        realm: 'MoonCraft Editor',
        msg401: 'Client Authentication Required',
        msg407: 'Proxy Authentication Required ',
        skipUser: true
    }, function (username, password, next) {
        next(username === CONFIG.editor.username && password === CONFIG.editor.password);
    }
);

let app = express();

app.use('/editor', auth.connect(basic));

app.use(express.static('client/public', options));

app.get('/*', function(req, res) {
    res.sendFile(__dirname + '/public/not-found.html');
});

module.exports = {
    app   : app,
    logger: logger
};