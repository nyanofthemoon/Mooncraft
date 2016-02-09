'use strict';

let Logger        = require('./logger');
let Player        = require('./player');
let Region        = require('./region');
let FixtureClient = require('./../db/fixture/client');
let RedisClient   = require('./../db/redis-client');
let Cycling       = require('./../workers/cycling');
let Regeneration  = require('./../workers/regeneration');

let config = require('./../config');

class World {

    constructor(config) {
        this.logger  = new Logger('WORLD', config);
        this.sockets = null;
        this.source  = null;
        this.data    = {
            players  : {},
            sessions : {},
            regions  : {}
        };
    }

    addPlayer(player) {
        this.data.players[player.getId()] = player;
    };

    getPlayer(sessionIdentifier) {
        return this.data.players[sessionIdentifier] || null;
    };

    getRegion(id) {
        return this.data.regions[id] || null;
    };

    static initialize(io) {
        return new Promise(function(resolve, reject) {
            let world     = new World(config);
            world.sockets = io.sockets;
            new RedisClient(config).initialize()
                .then(function(clientOne) {

                    // Subscribe to Events
                    let cycling = new Cycling(config);
                    cycling.subscribe(clientOne);
                    let regeneration = new Regeneration(config);
                    regeneration.subscribe(clientOne);

                    // Handle Event Messages
                    clientOne.on('message', function(channel, message) {
                        switch (channel) {
                            case cycling.namespace:
                                cycling.notify(world.sockets, message);
                                break;
                            case regeneration.namespace:
                                let data = regeneration.notify(world.sockets, message);
                                ///////////////////////////////////////////////////////////////////////
                                // @TODO Implement worker functionality based on map schema.
                                // @TODO Persist New Region Data : region.save
                                // @TODO Update World Data       : world.data.regions[data.id] = region
                                ///////////////////////////////////////////////////////////////////////
                                break;
                            default: break;
                        }
                        world.logger.info('Notification received from ' + channel, message);
                    });

                    new RedisClient(config).initialize()
                        .then(function (clientTwo) {
                            world.source = clientTwo;
                            // Load Region Data
                            FixtureClient.readRegions()
                                .then(function (fixtureRegions) {
                                    Region.findAll(world.source)
                                        .then(function (persistedRegions) {
                                            // Initialize Regions
                                            let regions = [];
                                            if (persistedRegions) {
                                                Object.keys(persistedRegions).forEach(function(key) {
                                                    regions.push(persistedRegions[key]);
                                                });
                                            } else {
                                                regions = fixtureRegions;
                                            }
                                            regions.forEach(function(data) {
                                                let region = new Region(config);
                                                region.initialize(world.sockets, world.source, JSON.parse(data));
                                                world.data.regions[region.getId()] = region;
                                            });
                                            Player.findAll(world.source)
                                                .then(function(players) {
                                                    // Initialize Players
                                                    if (players) {
                                                        Object.keys(players).forEach(function(key) {
                                                            let player = new Player(config);
                                                            player.initialize(null, world.source, JSON.parse(players[key]));
                                                            world.data.players[player.getId()] = player;
                                                        });
                                                    }
                                                    resolve(world);
                                                }).catch(function (e) {
                                                    reject(e);
                                                });
                                        }).catch(function (e) {
                                            reject(e);
                                        });
                                }).catch(function (e) {
                                    reject(e);
                                });
                        }).catch(function (e) {
                            reject(e);
                        });
                }).catch(function (e) {
                    reject(e);
                });
        });
    }

    getPlayerBySocketId(id) {
        return this.data.players[this.data.sessions[id]];
    }

    bindSocketToModuleEvents(socket) {
        var that = this;
        try {
            socket.on('error', function(data) { that.error(data, socket); });
            socket.on('query', function(data) { that.query(data, socket); });
            socket.on('enter', function(data) { that.enter(data, socket); });
            socket.on('move',  function(data) { that.move(data, socket); });
            socket.on('leave', function(data) { that.leave(data, socket); });
            //socket.on('harvest', function(data) { that.harvest(data, socket); });
            //socket.on('build', function(data) { that.build(data, socket); });
            //socket.on('investigate', function(data) { that.investigate(data, socket); });
            //socket.on('pickup', function(data) { that.pickup(data, socket); });
            //socket.on('drop', function(data) { that.drop(data, socket); });
        } catch (e) {
            this.logger.error('Socket ' + socket.id + ' not bound to events ', e);
        }
    }

    error(data, socket) {
        try {
            socket.emit('error', {event: 'error'});
        } catch (e) {
            this.logger.error('An unknown socket error has occured', e);
        }
    }

    query(data, socket) {
        try {
            let info = {
                'type': data.type,
                'data': {}
            };
            switch(data.type) {
                case 'map':
                    info.data = this.data.regions[data.id].query();
                    break;
                case 'player':
                    info.data = this.getPlayerBySocketId(socket.id).query();
                    break;

                default: break;
            }
            socket.emit('query', info);
            this.logger.verbose('[QUERY] ' + JSON.stringify(info));
        } catch (e) {
            this.logger.error('[QUERY] ' + JSON.stringify(info) + ' ' + e);
        }
    }

    enter(data, socket) {
        try {
            let player = this.getPlayerBySocketId(socket.id);
            let region = this.getRegion[data.id];
            if (player.canEnter(region)) {
                //this.data.regions[data.id].enter(player);
                //this.logger.verbose('[ENTER] ' + JSON.stringify(data));
            }
        } catch (e) {
            this.logger.error('[ENTER] ' + JSON.stringify(data) + ' ' + e);
        }
    }

    leave(data, socket) {
        try {
            let player = this.getPlayerBySocketId(socket.id);
            let region = this.getRegion[data.id];
            if (player.canLeave(region)) {
                region.leave(player);
                this.logger.verbose('[ENTER] ' + JSON.stringify(data));
            }
            this.logger.verbose('[LEAVE] ' + JSON.stringify(data));
        } catch (e) {
            this.logger.error('[LEAVE] ' + JSON.stringify(data), e);
        }
    }

    move(data, socket) {
        try {
            let player = this.getPlayerBySocketId(socket.id);
            let region = this.getRegion[data.id];
            if (player.canMove(region, data.x, data.y)) {
                region.move(player, data.x, data.y);
                player.increaseActivity();
                socket.emit('verbose', {event: 'move'});
                this.logger.verbose('[MOVE] ' + JSON.stringify(data));
            }
        } catch (e) {
            this.logger.error('[MOVE] ' + JSON.stringify(data), e);
        }
    }

    /*
    harvest(data, socket) {
        try {
            player.increaseActivity();
            socket.emit('verbose', {event: 'harvest'});
            this.logger.verbose('[HARVEST] ' + JSON.stringify(data));
        } catch (e) {
            this.logger.error('[HARVEST] ' + JSON.stringify(data), e);
        }
    }

    build(data, socket) {
        try {
            player.increaseActivity();
            socket.emit('verbose', {event: 'build'});
            this.logger.verbose('[BUILD] ' + JSON.stringify(data));
        } catch (e) {
            this.logger.error('[BUILD] ' + JSON.stringify(data), e);
        }
    }

    investigate(data, socket) {
        try {
            socket.emit('verbose', {event: 'investigate'});
            this.logger.verbose('[INVESTIGATE] ' + JSON.stringify(data));
        } catch (e) {
            this.logger.error('[INVESTIGATE] ' + JSON.stringify(data), e);
        }
    }

    pickup(data, socket) {
        try {
            player.increaseActivity();
            socket.emit('verbose', {event: 'pickup'});
            this.logger.verbose('[PICKUP] ' + JSON.stringify(data));
        } catch (e) {
            this.logger.error('[PICKUP] ' + JSON.stringify(data), e);
        }
    }

    drop(data, socket) {
        try {
            player.increaseActivity();
            socket.emit('verbose', {event: 'drop'});
            this.logger.verbose('[DROP] ' + JSON.stringify(data));
        } catch (e) {
            this.logger.error('[DROP] ' + JSON.stringify(data), e);
        }
    }
    */

};

module.exports = World;