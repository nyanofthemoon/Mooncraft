'use strict';

let fs = require('fs');

const TILES = require('./tiles.json');
const NODES = require('./nodes.json');
const ITEMS = require('./items.json');
const AUDIO = require('./audio.json');

var graphicalAssetStream = fs.createWriteStream('./client/src/package/graphic.js');
graphicalAssetStream.on('open', function(fileDescriptor) {

    graphicalAssetStream.write('let TILES = [];\n');
    for (let tileIndex in TILES) {
        graphicalAssetStream.write('TILES.push({"id": "' + TILES[tileIndex].icon + '", "url": "tiles/' + TILES[tileIndex].icon + '.gif"});\n');
    }
    graphicalAssetStream.write('\n');

    graphicalAssetStream.write('let NODES = [];\n');
    for (let nodeIndex in NODES) {
        graphicalAssetStream.write('NODES.push({"id": "' + NODES[nodeIndex].icon + '", "url": "nodes/' + NODES[nodeIndex].icon + '.gif"});\n');
    }
    graphicalAssetStream.write('\n');

    graphicalAssetStream.write('let ITEMS = [];\n');
    for (let itemIndex in ITEMS) {
        graphicalAssetStream.write('ITEMS.push({"id": "' + ITEMS[itemIndex].icon.singular + '", "url": "items/' + ITEMS[itemIndex].icon.singular + '.gif"});\n');
        graphicalAssetStream.write('ITEMS.push({"id": "' + ITEMS[itemIndex].icon.plural + '", "url": "items/' + ITEMS[itemIndex].icon.plural + '.gif"});\n');
    }
    graphicalAssetStream.write('\n');

    graphicalAssetStream.write('module.exports = {\n');
    graphicalAssetStream.write('TILES: TILES,\n');
    graphicalAssetStream.write('NODES: NODES,\n');
    graphicalAssetStream.write('ITEMS: ITEMS\n');
    graphicalAssetStream.write('}');

    graphicalAssetStream.end();
});

var audioAssetStream = fs.createWriteStream('./client/src/package/audio.js');
    audioAssetStream.on('open', function(fileDescriptor) {
    audioAssetStream.write('module.exports = {\n');
    audioAssetStream.write('MUSIC: ' + JSON.stringify(AUDIO.music) + ',\n');
    audioAssetStream.write('SOUND: ' + JSON.stringify(AUDIO.sound) + '\n');
    audioAssetStream.write('}');
    audioAssetStream.end();
});

var editorAssetStream = fs.createWriteStream('./client/public/editor/js/graphic.js');
    editorAssetStream.on('open', function(fileDescriptor) {
    editorAssetStream.write('var TILES = ' + JSON.stringify(TILES) + ';\n');
    editorAssetStream.write('var NODES = ' + JSON.stringify(NODES) + ';\n');
    editorAssetStream.write('var ITEMS = ' + JSON.stringify(ITEMS) + ';');
    editorAssetStream.end();
});