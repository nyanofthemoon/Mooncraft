'use strict';

var socket = io.connect("http://localhost:8888", { "query": { "name": "The Untitled", "pass": "qwerty" } });

function emitQuery(type, id) {
    socket.emit('query', { type: type, id: id });
}

function emitMove(id, x, y) {
    socket.emit('move', { id: id, x: x, y: y });
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
socket.on('cycle', function (data) {
    console.log('Received event: cycle with data:', data);
});
socket.on('query', function (data) {
    console.log('Received event: query with data:', data);
});
socket.on('enter', function (data) {
    console.log('Received event: enter with data:', data);
});
socket.on('move', function (data) {
    console.log('Received event: move with data:', data);
});
socket.on('leave', function (data) {
    console.log('Received event: leave with data:', data);
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

setTimeout(function () {
    emitQuery('player');
    setTimeout(function () {
        emitEnter('0');
        /*
         emitQuery('map', 'test');
         setTimeout(function () {
         emitMove('test', 1,1);
         emitInvestigate('test', 1,1);
         setTimeout(function () {
         //emitLeave('2');
         }, 1000);
         }, 1000);
         */
    }, 1000);
}, 1000);
//# sourceMappingURL=main.transpiled.js.map
//# sourceMappingURL=main.transpiled.js.map
