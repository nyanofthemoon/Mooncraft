'use strict';

import io from 'socket.io-client';

import Config from './../config';
import * as types from './../constants/ActionTypes'

let socket;

export function createSocketConnection(username, password) {
    if (Config.environment.isVerbose()) { console.log('[WebSocket] Emit Connection for ' + username); }
    socket = io.connect('//' + Config.environment.host + Config.environment.port, { "query": { "name": username, "pass": password } });
    return socket;
}

export function emitSocketPlayerQueryEvent() {
    if (Config.environment.isVerbose()) { console.log('[WebSocket] Emit Player Query'); }
    socket.emit('query', { type: 'player' });
}

export function emitPlayerEnter(id) {
    if (Config.environment.isVerbose()) { console.log('[WebSocket] Emit Player Enter'); }
    socket.emit('enter', { id: id });
}

export function emitPlayerLeave(id) {
    if (Config.environment.isVerbose()) { console.log('[WebSocket] Emit Player Leave'); }
    socket.emit('leave', { id: id });
}

export function emitPlayerMove(id, x, y) {
    if (Config.environment.isVerbose()) { console.log('[WebSocket] Emit Player Move (' + x + ',' + y + ')'); }
    socket.emit('move', { id: id, x: x, y: y });
}

export function emitPlayerHarvest(id, x, y) {
    if (Config.environment.isVerbose()) { console.log('[WebSocket] Emit Player Harvest (' + x + ',' + y + ')'); }
    socket.emit('harvest', { id: id, x: x, y: y });
}

export function emitSocketCyclingQueryEvent() {
    if (Config.environment.isVerbose()) { console.log('[WebSocket] Emit Cycling Query'); }
    socket.emit('query', { type: 'cycling' });
}

export function emitSocketRegionQueryEvent(id) {
    if (Config.environment.isVerbose()) { console.log('[WebSocket] Emit Region Query for ' + id); }
    socket.emit('query', { type: 'region', id: id });
}