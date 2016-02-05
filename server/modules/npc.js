'use strict';

let Promise = require('bluebird');

let Logger = require('./logger');

class NPC {

    constructor(config) {
        this.logger = new Logger('NPC', config);
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

module.exports = NPC;