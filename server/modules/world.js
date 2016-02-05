'use strict';

let Promise = require('bluebird');

let Logger      = require('./logger');
let RedisClient = require('./../db/redis-client');

let Cycling = require('./../workers/cycling');

let config = require('./../config');

class World {

    constructor(config) {
        this.logger = new Logger('WORLD', config);
        this.socket = null;
        this.data   = {};
    }

    static initialize(socket) {
        return new Promise(function(resolve, reject) {
            let world    = new World(config);
            world.socket = socket;
            new RedisClient(config).initialize()
                .then(function(client) {

                    // Subscribe to Global Events
                    let cycling = new Cycling(config);
                    cycling.subscribe(client);

                    // Handle Global Events
                    client.on('message', function(channel, message) {
                        switch (channel) {
                            case cycling.namespace:
                                cycling.handle(socket, message);
                                break;
                            default: break;
                        }
                        world.logger.verbose('Notification received on ' + channel + ' with ' + message);
                    });

                    resolve(world);
                })
                .catch(function (e) {
                    reject(e);
                });
        });
    }

    bindSocketToModuleEvents(socket) {
        var that = this;
        try {
            socket.on('error', function(data) { that.error(data, socket); });
            socket.on('enter', function(data) { that.enter(data, socket); });
            socket.on('leave', function(data) { that.leave(data, socket); });
            socket.on('move',  function(data) { that.move(data, socket); });
            socket.on('harvest', function(data) { that.harvest(data, socket); });
            socket.on('build', function(data) { that.build(data, socket); });
            socket.on('inspect', function(data) { that.inspect(data, socket); });
            socket.on('pickup', function(data) { that.pickup(data, socket); });
            socket.on('drop', function(data) { that.drop(data, socket); });
            this.logger.verbose(socket.id + ' bound to module events');
        } catch (e) {
            this.logger.error(socket.id + ' not bound to module events ' + e);
        }
    }

    error(data, socket) {
        try {
            socket.emit('error', {event: 'error'});
            this.logger.verbose('[ERROR] ' + data.toString());
        } catch (e) {
            this.logger.error('[ERROR] ' + e);
        }
    }

    enter(data, socket) {
        try {
            socket.join(data.name);
            socket.emit('verbose', {event: 'enter', name: data.name});
            this.logger.verbose('[ENTER] ' + JSON.stringify(data));
        } catch (e) {
            this.logger.error('[ENTER] ' + JSON.stringify(data) + ' ' + e);
        }
    }

    leave(data, socket) {
        try {
            socket.leave(data.name);
            socket.emit('verbose', {event: 'leave', name: data.name});
            this.logger.verbose('[LEAVE] ' + JSON.stringify(data));
        } catch (e) {
            this.logger.error('[LEAVE] ' + JSON.stringify(data) + ' ' + e);
        }
    }

    move(data, socket) {
        try {
            socket.emit('verbose', {event: 'move'});
            this.logger.verbose('[MOVE] ' + JSON.stringify(data));
        } catch (e) {
            this.logger.error('[MOVE] ' + JSON.stringify(data) + ' ' + e);
        }
    }

    harvest(data, socket) {
        try {
            socket.emit('verbose', {event: 'harvest'});
            this.logger.verbose('[HARVEST] ' + JSON.stringify(data));
        } catch (e) {
            this.logger.error('[HARVEST] ' + JSON.stringify(data) + ' ' + e);
        }
    }

    build(data, socket) {
        try {
            socket.emit('verbose', {event: 'build'});
            this.logger.verbose('[BUILD] ' + JSON.stringify(data));
        } catch (e) {
            this.logger.error('[BUILD] ' + JSON.stringify(data) + ' ' + e);
        }
    }

    inspect(data, socket) {
        try {
            socket.emit('verbose', {event: 'inspect'});
            this.logger.verbose('[INSPECT] ' + JSON.stringify(data));
        } catch (e) {
            this.logger.error('[INSPECT] ' + JSON.stringify(data) + ' ' + e);
        }
    }

    pickup(data, socket) {
        try {
            socket.emit('verbose', {event: 'pickup'});
            this.logger.verbose('[PICKUP] ' + JSON.stringify(data));
        } catch (e) {
            this.logger.error('[PICKUP] ' + JSON.stringify(data) + ' ' + e);
        }
    }

    drop(data, socket) {
        try {
            socket.emit('verbose', {event: 'drop'});
            this.logger.verbose('[DROP] ' + JSON.stringify(data));
        } catch (e) {
            this.logger.error('[DROP] ' + JSON.stringify(data) + ' ' + e);
        }
    }

};

module.exports = World;