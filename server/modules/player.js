'use strict';

let CryptoJS = require('crypto-js');

let Logger   = require('./logger');
const CONFIG = require('./../config');

class Player {

    constructor(config) {
        this.logger   = new Logger('PLAYER', config);
        this.socket   = null;
        this.source   = null;
        this.activity = 0;
        this.data     = {
            name: CONFIG.player.defaultName,
            pass: '',
            icon: CONFIG.player.defaultIcon,
            region: {
                id  : CONFIG.player.originRegionId,
                x   : CONFIG.player.originRegionX,
                y   : CONFIG.player.originRegionY
            },
            inventory: CONFIG.player.defaultInventory
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

    static getId(name, pass) {
        return CryptoJS.SHA3(pass + CONFIG.player.salt + [...name].reverse().join());
    }

    getId() {
        return Player.getId(this.data.name, this.data.pass);
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

    getRegionId() {
        return this.data.region.id;
    }

    getInventory() {
        return this.data.inventory;
    }

    addItemToInventory(item) {
        if (this.data.inventory[item.getId()]) {
            this.data.inventory[item.getId()].data.quantity = this.data.inventory[item.getId()].data.quantity + item.getQuantity();
        } else {
            this.data.inventory[item.getId()] = item;
        }
    }

    removeItemFromInventory(item) {
        if (this.data.inventory[item.getId()]) {
            this.data.inventory[item.getId()].data.quantity = this.data.inventory[item.getId()].data.quantity - item.getQuantity();
            if (this.data.inventory[item.getId()].getQuantity() <= 0) {
                delete this.data.inventory[item.getId()];
            }
        }
    }

    query(self) {
        var struct = {
            'type': 'player',
            'self': false,
            'data': {
                'name': this.getName(),
                'icon': this.getIcon(),
                'region': this.getRegion()
            }
        };

        if (self) {
            struct.self           = true;
            struct.data.inventory = this.getInventory();
        }

        return struct;
    }

    canEnter(region) {
        if (this.data.region.id != region.getId()) {
            return true;
        } else {
            return false;
        }
    }

    enter(region) {
        this.socket.join(region.getId());
        this.data.region.id = region.getId();
        this.data.region.x  = region.getXOrigin();
        this.data.region.y  = region.getYOrigin();
        this.socket.emit('query', this.query(true));
        this.socket.to(region.getId()).emit('enter', this.query(false));
    }

    canLeave(region) {
        if (this.data.region.id == region.getId()) {
            return true;
        } else {
            return false;
        }
    }

    leave(region) {
        this.socket.leave(region.getId());
        region.socket.to(region.getId()).emit('leave', this.query(false));
    }

    canSay(region) {
        // Can only say within the same region
        return this._isInRegion(region);
    }

    say(region, message) {
        region.socket.to(region.getId()).emit('say', {
            name   : this.getName(),
            message: message
        });
    }

    canMove(region, x, y) {
        // Can only move within the same region and to an adjacent tile.
        if (!this._isInRegion(region) || !this._isAdjacentTo(x, y)) {
            return false
        }

        // Can only walk on "walkable" tiles
        let tile = region.getTile(x, y);
        if (!tile.isWalkable()) {
            return false;
        }

        // Can only walk on "walkable" nodes
        let node = region.getNode(x, y);
        if (!node.isWalkable()) {
            return false;
        }

        // Can only walk if all contained items are "walkable"
        let canWalkOverAllItems = true;
        let items               = region.getItems(x, y);
        items.forEach(function(item) {
            if (!item.isWalkable()) {
                canWalkOverAllItems = false;
                return;
            }
        });

        return canWalkOverAllItems;
    }

    move(region, x, y) {
        this.increaseActivity();
        this.data.region.x = x;
        this.data.region.y = y;
        this.socket.to(region.getId()).emit('query', this.query(false));
        this.socket.emit('query', this.query(true));
    }

    canHarvest(region, x, y) {
        // Can only harvest within the same region and to an adjacent tile.
        if (!this._isInRegion(region) || !this._isAdjacentTo(x, y)) {
            return false;
        }

        // Can only harvest "harvestable" nodes
        let node = region.getNode(x, y);
        if (!node.isHarvestable()) {
            return false;
        }

        return true;
    }

    harvest(region, x, y) {
        var harvestedItem = region.getNode(x, y).harvest();
        region.socket.to(region.getId()).emit('query', region.query());
        if (harvestedItem) {
            this.addItemToInventory(harvestedItem);
            this.socket.emit('query', this.query(true));
        }
    }

    canBuild(region, x, y) {
        // Can only build within the same region and to an adjacent tile.
        if (!this._isInRegion(region) || !this._isAdjacentTo(x, y)) {
            return false
        }

        // Can only build over "buildable" nodes
        let node = region.getNode(x, y);
        if (!node.isBuildable()) {
            return false;
        }

        return true;
    }

    build() {
        // @TODO
    }

    canPickUp(region, x, y) {
       let items = region.getItems(x, y);
       if (!items || items.length < 1) {
           return false;
       }

       return true;
    }

    pickup() {
        // @TODO
    }

    canDrop(region, x, y) {
        let tile = region.getTile(x, y);
        let node = region.getNode(x, y);
        if (tile.isDroppable() && node.isDroppable()) {
            return true;
        }

        return false;
    }

    drop() {
        // @TODO
    }

    canInvestigate(region, x, y) {
        // Can only investigate within the same region and to an adjacent tile.
        if (!this._isInRegion(region) || !this._isAdjacentTo(x, y)) {
            return false
        }

        return true;
    }

    investigate(region, x, y) {
        let items = [];
        region.getItems(x, y).forEach(function(item) {
            if (!item.isInvisible()) {
                items.push[{
                    'name'       : item.getName(),
                    'description': item.getDescription(),
                    'quantity'   : item.getQuantity(),
                    'unitValue'  : item.getUnitValue(),
                    'unitWeight' : item.getUnitWeight()
                }];
            }
        });
        this.socket.emit('query', {
            type: 'coordinates',
            data: {
                'id'           : region.getId(),
                'x'            : x,
                'y'            : y,
                'description'  : region.getCoordinatesDescription(x, y),
                'walkable'     : this.canMove(region, x, y),
                'harvestable'  : this.canHarvest(region, x, y),
                'buildable'    : this.canBuild(region, x, y),
                'pickable'     : this.canPickUp(region, x, y),
                'droppable'    : this.canDrop(region, x, y),
                'items'        : items
            }
        });
    }

    _isInRegion(region) {
        if (this.data.region.id == region.getId()) {
            return true;
        } else {
            return false;
        }
    }

    _isAdjacentTo(x, y) {
        if (Math.abs(this.data.region.x - x) <= 1 && Math.abs(this.data.region.y - y) <= 1) {
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