'use strict';

var random = new Date().getSeconds();
var socket = io.connect("http://localhost:8888", { "query": { "name": "The Untitled" + random, "pass": "qwerty" } });

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

setTimeout(function () {
    emitQuery('player');
    setTimeout(function () {
        emitEnter('T0');
        setTimeout(function () {
            emitSay('T0', 'Hello World!');
            emitMove('T0', 1, 2);
            setTimeout(function () {
                emitQuery('player');
                emitLeave('T0');

                //setTimeout(function () {
                //}, 250);
            }, 250);
        }, 250);
    }, 1000);
}, 1000);
//# sourceMappingURL=main.transpiled.js.map
//# sourceMappingURL=main.transpiled.js.map
//# sourceMappingURL=main.transpiled.js.map
//# sourceMappingURL=main.transpiled.js.map
