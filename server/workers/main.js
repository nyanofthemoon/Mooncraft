'use strict';

let RedisClient = require('./../db/redis-client');

let Cycling  = require('./cycling');

let config = require('./../config');

new RedisClient(config).initialize()
    .then(function(redisClient) {
        new Cycling(config, redisClient).start();
    });