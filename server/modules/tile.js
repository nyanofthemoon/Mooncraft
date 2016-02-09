'use strict';

const FIXTURES = {
    0: {
        "name"       : "Void",
        "icon"       : "tile/void",
        "description": "The edge of the world.",
        "walkable"   : false
    },
    1: {
        "name"       : "Sand",
        "icon"       : "tile/sand",
        "description": "A patch of sand.",
        "walkable"   : true
    },
    2: {
        "name"       : "Grass",
        "icon"       : "tile/grass",
        "description": "A patch of grass.",
        "walkable"   : true
    },
    3: {
        "name"       : "Water",
        "icon"       : "tile/water",
        "description": "A patch of shallow water.",
        "walkable"   : false
    }
};

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