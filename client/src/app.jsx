'use strict';

require('./scss/app.scss');

import React    from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';

import App from './jsx/App';

ReactDOM.render(<App />, document.getElementById('app'));

// test ....

var random = new Date().getSeconds();
var socket = io.connect('//' + document.location.hostname + ":8888", { "query": { "name": "The Untitled" + random, "pass": "qwerty" } });

function emitQuery(type, id) {
    socket.emit('query', { type: type, id: id });
}

function emitMove(id, x, y) {
    socket.emit('move', { id: id, x: x, y: y });
}

function emitSay(id, message) {
    socket.emit('say', { id: id, message: message });
}

function emitEnter(id) {
    socket.emit('enter', { id: id });
}

function emitLeave(id) {
    socket.emit('leave', { id: id });
}

function emitHarvest(id, x, y) {
    socket.emit('harvest', { id: id, x: x, y: y });
}

function emitBuild(id, x, y, type) {
    socket.emit('build', { id: id, x: x, y: y, type: 0 });
}

function emitInvestigate(id, x, y) {
    socket.emit('investigate', { id: id, x: 0, y: 1 });
}

// Custom - Debug
socket.on('query', function (data) {
    console.log('Received event: query with data:', data);
});
socket.on('enter', function (data) {
    console.log('Received event: enter with data:', data);
});
socket.on('move', function (data) {
    console.log('Received event: move with data:', data);
});
socket.on('say', function (data) {
    console.log('Received event: say with data:', data);
});
socket.on('leave', function (data) {
    console.log('Received event: leave with data:', data);
});

socket.on('cycling', function (data) {
    console.log('Received event: cycling with data:', data);
});
socket.on('regeneration', function (data) {
    console.log('Received event: regeneration with data:', data);
});

socket.on('verbose', function (data) {
    console.log('Received event: verbose with data:', data);
});
socket.on('connect', function (data) {
    console.log('Received event: connect with data:', data);
});
socket.on('disconnect', function (data) {
    console.log('Received event: disconnect with data:', data);
});


// *** Login Flow *** //
// Emit Event 'connect' with username/password
// Await Event 'connect'
//// Emit Event 'query' for 'player'
//// Emit Event 'query' for 'region'
//// Await Event 'query' for 'region' and 'player'
////// Draw All The Things
setTimeout(function () {
    emitQuery('player');
    emitQuery('region', 'CG');
}, 100);

// *** Move Flow *** //
// Emit Event 'move'
// Await Event 'move'
//// If move is me then confirm location, if move is not me then move other player on map
setTimeout(function () {
    emitEnter('T0');
    setTimeout(function () {
        emitMove('T0', 1, 2);
    }, 1000);
}, 1000);

/*
 setTimeout(function () {
 emitEnter('T0');
 setTimeout(function () {
 emitSay('T0', 'Hello World');
 emitMove('T0', 1, 2);
 setTimeout(function () {
 emitQuery('region', 'T0');
 emitLeave('T0');

 //setTimeout(function () {
 //}, 250);
 }, 250);
 }, 250);
 }, 1000);
 */