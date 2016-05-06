'use strict';

const FIXTURES = require('./../db/fixture/tiles.json');

class Tile {

    constructor(id) {
        this.mutate(id);
    }

    static getTypeDefinition(id) {
        return JSON.parse(JSON.stringify(FIXTURES[id]));
    }

    isWalkable() {
        return this.data.walkable;
    }

    mutate(id, data) {
        this.data    = Tile.getTypeDefinition(id);
        this.data.id = id;
        if (data) {
            var that = this;
            Object.keys(data).forEach(function(key) {
                that.data[key] = data[key];
            });
        }
    }

};

module.exports = Tile;