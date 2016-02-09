'use strict';

let RedisClient  = require('./../db/redis-client');
let Cycling      = require('./cycling');
let Regeneration = require('./regeneration');

let config = require('./../config');

new RedisClient(config).initialize()
    .then(function(client) {

        // Day & Night Cycles
        new Cycling(config, client).start();

        // Resource Regeneration
        new Regeneration(config, client).start();

    });