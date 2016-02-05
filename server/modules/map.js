'use strict';

let Promise = require('bluebird');

let Logger = require('./logger');

class Map {

    constructor(config) {
        this.logger = new Logger('MAP', config);
        this.data   = {};
    }

    initialize(data) {
        var that = this;
        return new Promise(function(resolve, reject) {
            try {
                that.data = data;
                resolve(map);
            } catch (e) {
                reject(e);
            }
        });
    }

};

module.exports = Map;