'use strict';

let Logger = require('./logger');
let Tile   = require('./tile');
let Node   = require('./node');
let Item   = require('./item');

const CONFIG = require('./../config');

class Region {

    constructor(config) {
        this.logger       = new Logger('REGION', config);
        this.socket       = null;
        this.source       = null;
        this.data         = {
            'id'         : null,
            'name'       : null,
            'description': null,
            'fixture'    : {},
            'progress'    : {
                'nodes': [],
                'items': []
            }
        };
        this.tiles = [];
        this.nodes = [];
        this.items = [];
    }

    initialize(socket, source, data) {
        this.socket           = socket;
        this.source           = source;
        var that              = this;
        Object.keys(data).forEach(function(key) {
            that.data[key] = data[key];
        });

        for (var x in this.data.fixture.tiles) {
            if (!this.tiles[x]) {
                this.tiles[x] = [];
                this.nodes[x] = [];
                this.items[x] = [];
            }
            for (var y in this.data.fixture.tiles[x]) {
                this.tiles[x][y] = new Tile(this.data.fixture.tiles[x][y]);
                this.nodes[x][y] = new Node(1);
                this.items[x][y] = [];
            }
        }

        if (this.data.progress) {
            // Initialize Nodes
            for (var i in this.data.progress.nodes) {
                let ndata = this.data.progress.nodes[i];
                this.nodes[ndata.y][ndata.x] = new Node(ndata.id, this.data.progress.nodes[i]);
            }

            // Initialize Items
            for (var i in this.data.progress.items) {
                let idata = this.data.progress.items[i];
                this.items[ndata.y][ndata.x].push(new Item(idata.id, this.data.progress.items[i]));
            }
        }
    }

    // Return a promise
    static findOne(source, id) {
        return source.hgetAsync('region', id);
    }

    // Return a promise
    static findAll(source) {
        return source.hgetallAsync('region');
    }

    // Return a promise
    static findAllIds(source) {
        return source.hkeysAsync('region');
    }

    // Return a promise
    save() {
        return this.source.hsetAsync('region', this.getId(), JSON.stringify(this.data));
    }

    getId() {
        return this.data.id;
    }

    getName() {
        return this.data.name;
    }

    getDescription() {
        return this.data.description;
    }

    getCoordinatesDescription(x, y) {
        let node = this.getNode(x, y);
        if (node.getId() === CONFIG.region.defaultNodeId) {
            return this.getTile(x, y).getDescription();
        } else {
            return node.getDescription();
        }
    }

    getXOrigin() {
        return this.data.fixture.origin.x;
    }

    getYOrigin() {
        return this.data.fixture.origin.y;
    }

    getTile(x, y) {
        if (!this.tiles[y][x]) {
            return null;
        }

        return this.tiles[y][x];
    }

    getNode(x, y) {
        if (!this.nodes[y][x]) {
            return null;
        }

        return this.nodes[y][x];
    }

    getItems(x, y) {
        if (!this.items[y][x]) {
            return null;
        }

        return this.items[y][x];
    }

    query() {
        return {
            'type': 'region',
            'data': {
                'id'         : this.getId(),
                'name'       : this.getName(),
                'description': this.getDescription(),
                'tiles'      : this.tiles,
                'nodes'      : this.nodes,
                'items'      : this.items
            }
        };
    }

};

module.exports = Region;