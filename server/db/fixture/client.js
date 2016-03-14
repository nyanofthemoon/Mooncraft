'use strict';

var Promise = require('bluebird');
var fs      = Promise.promisifyAll(require('fs'));

class FixtureClient {

    static readRegions() {
        return FixtureClient._readAllFilesInSubdirectory('regions');
    }

    static _readAllFilesInSubdirectory(subdirectory) {
        return fs.readdirAsync(__dirname + '/' + subdirectory).map(function(filename) {
            return fs.readFileAsync(__dirname + '/' + subdirectory + '/' + filename, 'utf8');
        });
    }

    static _readFile(path) {
        return JSON.parse(fs.readFileSync(__dirname + '/' + path, 'utf8'));
    }

}

module.exports = FixtureClient;