'use strict';

let definitions = {
   'void' : {

   }
};

class Tile {

    constructor(x, y, type) {
        this.x    = x;
        this.y    = y;
        this.type = type;
    }

    static getTypeDefinition(type) {
        return definition[type];
    }

};

module.exports = Tile;