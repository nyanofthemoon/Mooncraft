'use strict';

const FIXTURES = require('./../db/fixture/tiles.json');

class Tile {

    constructor(id) {
        this.data = Tile.getTypeDefinition(id);
    }

    static getTypeDefinition(id) {
        return JSON.parse(JSON.stringify(FIXTURES[id]));
    }

    isWalkable() {
        return this.data.walkable;
    }

};

module.exports = Tile;