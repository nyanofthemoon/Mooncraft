'use strict';

let Logger = require('./logger');

class Character {

    constructor(config) {
        this.logger = new Logger('CHARACTER', config);
        this.data   = {};
    }

};

module.exports = Character;