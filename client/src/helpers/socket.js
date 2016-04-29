'use strict';

import io from 'socket.io-client';

import Config from './../config';

let socket;

export function createSocketConnection(username, password) {
    socket          = io.connect('//' + Config.environment.host + Config.environment.port, { "query": { "name": username, "pass": password } });
    let socketReady = new Promise(function(resolve) {
        socket.on('connect', function() {
            resolve(socket);
        });
    });

    return socketReady;
}

export function emitSocketPlayerQueryEvent() {
    socket.emit('query', { type: 'player' });
}

export function emitSocketRegionQueryEvent(id) {
    socket.emit('query', { type: 'region' });
}