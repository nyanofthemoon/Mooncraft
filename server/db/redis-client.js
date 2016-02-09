'use strict';

let Promise = require('bluebird');
let redis   = require('redis');

Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

let Logger = require('./../modules/logger');

class RedisClient {

    constructor(config) {
        this.logger  = new Logger('REDIS', config);
        this.url     = config.redis.url;
        this.options = config.redis.options;
    }

    initialize() {
        var that = this;
        return new Promise(function(resolve, reject) {
            try {
                let client = redis.createClient(that.url, that.options);
                that.logger.info('Connection established');
                resolve(client);
            } catch (e) {
                that.logger.error('Could not establish connection', e);
                reject(e);
            }
        });
    }

};

module.exports = RedisClient;