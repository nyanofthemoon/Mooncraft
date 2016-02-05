'use strict';

let Promise = require('bluebird');

let Logger = require('./logger');

class PC {

    constructor(config) {
        this.logger = new Logger('PC', config);
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

module.exports = PC;