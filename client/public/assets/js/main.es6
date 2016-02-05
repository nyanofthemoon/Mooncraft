'use strict';

var socket = io.connect("http://localhost:8888");

function emitMove() {
    socket.emit('move', {x:0, y:1});
}

function emitEnter() {
    socket.emit('enter', {name:'test'});
}

function emitLeave() {
    socket.emit('leave', {name:'test'});
}

function emitHarvest() {
    socket.emit('harvest', {x:0, y:1, type:0});
}

function emitBuild() {
    socket.emit('build', {x:0, y:1, type:0});
}

function emitInspect() {
    socket.emit('inspect', {x:0, y:1});
}

// Custom - Debug
socket.on('cycle', function(data) {
    console.log('Received event: cycle with data:', data);
});

socket.on('verbose', function(data) {
    console.log('Received event: verbose with data:', data);
});
socket.on('connect', function(data) {
    console.log('Received event: connect with data:', data);
});
socket.on('disconnect', function(data) {
    console.log('Received event: disconnect with data:', data);
});

setTimeout(function() {
    emitEnter();
    setTimeout(function() {
        emitMove();
        emitInspect();
        emitHarvest();
        setTimeout(function () {
            emitLeave();
        }, 1000);
    }, 1000);
}, 2000);