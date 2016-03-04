'use strict';

let FixtureClient = require('./../db/fixture/client');
const FIXTURES    = FixtureClient.readNodes();

class Tile {

    constructor(id) {
        this.data = Tile.getTypeDefinition(id);
    }

    static getTypeDefinition(id) {
        return FIXTURES[id];
    }

    isWalkable() {
        return this.data.walkable;
    }

};

module.exports = Tile;