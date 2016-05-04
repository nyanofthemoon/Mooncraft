'use strict';

let Item   = require('./item');

const FIXTURES = require('./../db/fixture/nodes.json');

class Node {

    constructor(id) {
        this.data    = JSON.parse(JSON.stringify(Node.getTypeDefinition(id)));
        this.data.id = id;
    }

    static getTypeDefinition(id) {
        return FIXTURES[id];
    }

    getName() {
        return this.data.name;
    }

    getDescription() {
        return this.data.description;
    }

    isWalkable() {
        if (this.data.walkable && this.data.walkable == true) {
            return true;
        } else {
            return false;
        }
    }

    isTransportable() {
        if (this.data.transportable && this.data.transportable == true) {
            return true;
        } else {
            return false;
        }
    }

    isOwnable() {
        if (this.data.ownable && this.data.ownable == true) {
            return true;
        } else {
            return false;
        }
    }

    isOwnedBy(player) {
        if (this.data.ownable && this.data.ownable.owner == player.name) {
            return true;
        } else {
            return false;
        }
    }

    isBuildable() {
        if (this.data.buildable && this.data.buildable == true) {
            return true;
        } else {
            return false;
        }
    }

    build() {
    }

    isHarvestable() {
        if (this.data.harvestable && this.data.harvestable.quantity > 0) {
            return true;
        } else {
            return false;
        }
    }

    harvest() {
        var item = null;
        this.data.harvestable.quantity--;
        if (this.data.harvestable.item) {
            item = new Item(this.data.harvestable.item);
        }
        if (this.data.harvestable.quantity < 1 && this.data.harvestable.transform) {
            this.mutate(this.data.harvestable.transform);
        }
        return item;
    }

    mutate(id, data) {
        this.data = JSON.parse(JSON.stringify(Node.getTypeDefinition(id)));
        if (data) {
            var that = this;
            Object.keys(data).forEach(function(key) {
                that.data[key] = data[key];
            });
        }
    }

};

module.exports = Node;