'use strict';

const FIXTURES = require('./../db/fixture/tiles.json');

class Tile {

    constructor(id) {
        this.mutate(id);
    }

    static getTypeDefinition(id) {
        return JSON.parse(JSON.stringify(FIXTURES[id]));
    }

    getId() {
        return this.data.id;
    }

    getName() {
        return this.data.name;
    }

    getIcon() {
        return this.data.icon;
    }

    getDescription() {
        return this.data.description;
    }

    isWalkable() {
        return this.data.walkable;
    }

    isDroppable() {
        return this.data.droppable;
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

    query() {
        return {
            'type': 'tile',
            'data': {
                'id'           : this.getId(),
                'name'         : this.getName(),
                'icon'         : this.getIcon(),
                'description'  : this.getDescription(),
                'walkable'     : this.isWalkable(),
                'droppable'    : this.isDroppable()
            }
        };
    }

};

module.exports = Tile;