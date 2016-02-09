'use strict';

let Logger = require('./logger');

class Player {

    constructor(config) {
        this.logger   = new Logger('PLAYER', config);
        this.socket   = null;
        this.source   = null;
        this.activity = 0;
        this.data   = {
            name:   'Unnamed',
            pass:   '',
            icon:   0,
            region: {
                id: null,
                x:  null,
                y:  null
            },
            inventory: []
        };
    }

    initialize(socket, source, data) {
        this.socket    = socket;
        this.source    = source;
        let that       = this;
        Object.keys(data).forEach(function(key) {
            that.data[key] = data[key];
        });
    }

    // Return a promise
    static findOne(source, id) {
        return source.hgetAsync('player', id);
    }

    // Return a promise
    static findAll(source) {
        return source.hgetallAsync('player');
    }

    // Return a promise
    save() {
        return this.source.hsetAsync('player', this.getId(), JSON.stringify(this.data));
    }

    getId() {
        return this.data.name + '-' + this.data.pass;
    }

    getName() {
        return this.data.name;
    }

    getIcon() {
        return this.data.icon;
    }

    getRegion() {
        return this.data.region;
    }

    getInventory() {
        return this.data.inventory;
    }

    query() {
        return {
            'name'     : this.getName(),
            'icon'     : this.getIcon(),
            'region'   : this.getRegion(),
            'inventory': this.getInventory()
        };
    }

    canEnter(region) {
        if (!this.data.region.id || this.data.region.id != region.getId()) {
            return true;
        } else {
            return false;
        }
    }

    canLeave(region) {
        if (this.data.region.id && this.data.region.id == region.getId()) {
            return true;
        } else {
            return false;
        }
    }

    canMove(region, x, y) {
        // Can only move within the same region and to an adjacent tile.
        if ((this.data.region.id && this.data.region.id == region.getId()) && (Math.abs(this.data.region.x - x) <= 1 && Math.abs(this.data.region.y - y) <= 1)) {
            return true;
        } else {
            return false;
        }
    }

    isActive() {
        return (this.activity >= 100);
    }

    resetActivity() {
        this.activity = 0;
    }

    increaseActivity() {
        this.activity++;
    }

};

module.exports = Player;