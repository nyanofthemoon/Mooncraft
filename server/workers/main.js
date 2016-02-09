'use strict';

let RedisClient  = require('./../db/redis-client');
let Cycling      = require('./cycling');
let Regeneration = require('./regeneration');

const CONFIG = require('./../config');

new RedisClient(CONFIG).initialize()
    .then(function(client) {

        // Day & Night Cycles
        new Cycling(CONFIG, client).start();

        // Resource Regeneration
        new Regeneration(CONFIG, client).start();

    });