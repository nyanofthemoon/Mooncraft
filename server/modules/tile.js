'use strict';

let fixtures = {
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

    constructor(x, y, id) {
        this.x    = x;
        this.y    = y;
        this.data = Tile.getTypeDefinition(id);
    }

    static getTypeDefinition(id) {
        return fixtures[id];
    }

    isWalkable(x, y) {
        return this.data.walkable;
    }

};

module.exports = Tile;