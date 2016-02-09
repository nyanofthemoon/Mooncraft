'use strict';

let Logger = require('./logger');
let Tile   = require('./tile');
let Node   = require('./node');
let Item   = require('./item');

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
                this.tiles[x][y] = new Tile(x, y, this.data.fixture.tiles[x][y]);
                this.nodes[x][y] = new Node(0);
                this.items[x][y] = [];
            }
        }

        if (this.data.progress) {
            // Initialize Nodes
            for (var i in this.data.progress.nodes) {
                let ndata = this.data.progress.nodes[i];
                this.nodes[ndata.x][ndata.y].mutate(ndata.id, ndata);
            }

            // Initialize Items
            for (var i in this.data.progress.items) {
                let idata = this.data.progress.items[i];
                let item = new Item(0);
                item.mutate(idata.id, idata);
                this.items[idata.x][idata.y].push(item);
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
    save() {
        return this.source.hsetAsync('region', this.getId(), JSON.stringify(this.data));
    }

    getId() {
        return this.data.id;
    }

    getName() {
        return this.data.name;
    }

    getXOrigin() {
        return this.data.fixture.origin.x;
    }

    getYOrigin() {
        return this.data.fixture.origin.y;
    }

    generate(nodes, items) {
    }

    query() {
        return {
            'id'         : this.data.id,
            'name'       : this.data.name,
            'description': this.data.description,
            'tiles'      : this.tiles,
            'nodes'      : this.nodes,
            'items'      : this.items
        };
    }

    enter(player) {
        this.socket.to(this.getId()).emit('enter', {
            name: player.getName(),
            icon: player.getIcon(),
            x   : this.getXOrigin(),
            y   : this.getYOrigin()
        });
        player.socket.join(this.getId());
    }

    leave(player) {
        player.socket.leave(this.getId());
        this.socket.to(this.getId()).emit('leave', {
            name: player.getName()
        });
    }

    move(player) {
        // @TODO Check if tile has node and it can be walked over
        // @TODO Check if tile has item and if it can be walked over
    }

    harvest() {
        // @TODO Check if tile has node and it can be harvested
    }

    build() {
        // @TODO Check if tile has node and it can be built over
    }

    pickup() {
        // @TODO Check if tile has one or more items and if it can be picked up
    }

    drop() {
        // @TODO Check if tile has no item and if item can be dropped down
    }

    investigate() {
        // @TODO Check if tile has node and give information
        // @TODO Check if title has one or more items hidden by the node which can be picked up
    }

};

module.exports = Region;