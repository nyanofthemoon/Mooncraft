'use strict';

const FIXTURES = require('./../db/fixture/tiles.json');

class Tile {

    constructor(id) {
        this.data = JSON.parse(JSON.stringify(Tile.getTypeDefinition(id)));
    }

    static getTypeDefinition(id) {
        return FIXTURES[id];
    }

    isWalkable() {
        return this.data.walkable;
    }

};

module.exports = Tile;