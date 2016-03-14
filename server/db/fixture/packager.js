'use strict';

let fs = require('fs');

const TILES = require('./tiles.json');
const NODES = require('./nodes.json');
const ITEMS = require('./items.json');

var assetStream = fs.createWriteStream('./client/src/package/assets.js');
assetStream.on('open', function(fileDescriptor) {

    assetStream.write('let TILES = [];\n');
    for (let tileIndex in TILES) {
        assetStream.write('TILES.push("tiles/' + TILES[tileIndex].icon + '.gif");\n');
    }
    assetStream.write('\n');

    assetStream.write('let NODES = [];\n');
    for (let nodeIndex in NODES) {
        assetStream.write('NODES.push("nodes/' + NODES[nodeIndex].icon + '.gif");\n');
    }
    assetStream.write('\n');

    assetStream.write('let ITEMS = [];\n');
    for (let itemIndex in ITEMS) {
        assetStream.write('ITEMS.push("items/' + ITEMS[itemIndex].icon.singular + '.gif");\n');
        assetStream.write('ITEMS.push("items/' + ITEMS[itemIndex].icon.plural + '.gif");\n');
    }
    assetStream.write('\n');

    assetStream.write('module.exports = {\n');
    assetStream.write('TILES: TILES,\n');
    assetStream.write('NODES: NODES,\n');
    assetStream.write('ITEMS: ITEMS\n');
    assetStream.write('}');

    assetStream.end();
});