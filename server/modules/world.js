'use strict';

var htmlEscape = require('secure-filters').html;

let Logger        = require('./logger');
let Player        = require('./player');
let Region        = require('./region');
let FixtureClient = require('./../db/fixture/client');
let RedisClient   = require('./../db/redis-client');
let Cycling       = require('./../workers/cycling');
let Regeneration  = require('./../workers/regeneration');

class World {

    constructor(config) {
        this.logger  = new Logger('WORLD', config);
        this.sockets = null;
        this.source  = null;
        this.workers = {};
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

    setRegion(id, data) {
        this.data.regions[id] = data;
    };

    getRegion(id) {
        return this.data.regions[id] || null;
    };

    static initialize(io, config) {
        return new Promise(function(resolve, reject) {
            let world     = new World(config);
            world.sockets = io;
            new RedisClient(config).initialize()
                .then(function(clientOne) {

                    // Subscribe to Events
                    let cycling = new Cycling(config);
                    cycling.subscribe(clientOne);
                    world.workers.cycling = cycling;
                    let regeneration = new Regeneration(config);
                    regeneration.subscribe(clientOne);

                    // Handle Event Messages
                    clientOne.on('message', function(channel, message) {
                        try {
                            message = JSON.parse(message);
                            switch (channel) {
                                case cycling.namespace:
                                    cycling.initialize(message);
                                    cycling.notify(world.sockets);
                                    break;
                                case regeneration.namespace:
                                    let region = world.getRegion(message.id);
                                    region.initialize(world.sockets, world.source, message.data);
                                    regeneration.notify(world.sockets, region);
                                    region.save();
                                    break;
                                default:
                                    break;
                            }
                            world.logger.info('Notification received from ' + channel, message);
                        } catch (e) {
                            world.logger.error('Notification error from ' + channel + ' with ' + message, e);
                        }
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
                                                world.setRegion(region.getId(), region);
                                                region.save();
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
            socket.on('error',       function(data) { that.error(data, socket); });
            socket.on('query',       function(data) { that.query(data, socket); });
            socket.on('enter',       function(data) { that.enter(data, socket); });
            socket.on('say',         function(data) { that.say(data, socket); });
            socket.on('move',        function(data) { that.move(data, socket); });
            socket.on('leave',       function(data) { that.leave(data, socket); });
            socket.on('harvest',     function(data) { that.harvest(data, socket); });
            socket.on('build',       function(data) { that.build(data, socket); });
            socket.on('investigate', function(data) { that.investigate(data, socket); });
            socket.on('pickup',      function(data) { that.pickup(data, socket); });
            socket.on('drop',        function(data) { that.drop(data, socket); });
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
            let info = null;
            switch(data.type) {
                case 'region':
                    info = this.data.regions[data.id].query();
                    break;
                case 'player':
                    info = this.getPlayerBySocketId(socket.id).query(true);
                    break;
                case 'cycling':
                    info = this.workers.cycling.query();
                    break;
                default: break;
            }
            socket.emit('query', info);
            this.logger.verbose('[QUERY] ' + data.type);
        } catch (e) {
            this.logger.error('[QUERY] ' + JSON.stringify(info) + ' ' + e);
        }
    }

    enter(data, socket) {
        try {
            let player = this.getPlayerBySocketId(socket.id);
            let region = this.getRegion(data.id);
            if (player.canEnter(region)) {
                player.enter(region);
            } else {
                this.logger.verbose('[ENTER] Invalid ' + JSON.stringify(data));
            }
        } catch (e) {
            this.logger.error('[ENTER] ' + JSON.stringify(data) + ' ' + e);
        }
    }

    leave(data, socket) {
        try {
            let player = this.getPlayerBySocketId(socket.id);
            let region = this.getRegion(data.id);
            if (player.canLeave(region)) {
                player.leave(region);
            } else {
                this.logger.verbose('[LEAVE] Invalid ' + JSON.stringify(data));
            }
        } catch (e) {
            this.logger.error('[LEAVE] ' + JSON.stringify(data), e);
        }
    }

    say(data, socket) {
        try {
            let player = this.getPlayerBySocketId(socket.id);
            let region = this.getRegion(data.id);
            if (player.canSay(region)) {
                player.say(region, htmlEscape(data.message));
            } else {
                this.logger.verbose('[SAY] Invalid ' + JSON.stringify(data));
            }
        } catch (e) {
            this.logger.error('[SAY] ' + JSON.stringify(data) + ' ' + e);
        }
    }

    move(data, socket) {
        try {
            let player = this.getPlayerBySocketId(socket.id);
            let region = this.getRegion(data.id);
            if (player.canMove(region, data.x, data.y)) {
                player.move(region, data.x, data.y);
            } else {
                this.logger.verbose('[MOVE] Invalid ' + JSON.stringify(data));
            }
        } catch (e) {
            this.logger.error('[MOVE] ' + JSON.stringify(data), e);
        }
    }

    harvest(data, socket) {
        try {
            let player = this.getPlayerBySocketId(socket.id);
            let region = this.getRegion(data.id);
            if (player.canHarvest(region, data.x, data.y)) {
                player.harvest(region, data.x, data.y);
            } else {
                this.logger.verbose('[HARVEST] Invalid ' + JSON.stringify(data));
            }
        } catch (e) {
            this.logger.error('[HARVEST] ' + JSON.stringify(data), e);
        }
    }

    build(data, socket) {
        try {
            let player = this.getPlayerBySocketId(socket.id);
            let region = this.getRegion(data.id);
            if (player.canBuild(region, data.x, data.y, data.id)) {
                player.build(region, data.x, data.y, data.id);
            } else {
                this.logger.verbose('[BUILD] Invalid ' + JSON.stringify(data));
            }
        } catch (e) {
            this.logger.error('[BUILD] ' + JSON.stringify(data), e);
        }
    }

    investigate(data, socket) {
        try {
            let player = this.getPlayerBySocketId(socket.id);
            let region = this.getRegion(data.id);
            if (player.canInvestigate(region, data.x, data.y)) {
                player.investigate(region, data.x, data.y);
            } else {
                this.logger.verbose('[INVESTIGATE] Invalid ' + JSON.stringify(data));
            }
        } catch (e) {
            this.logger.error('[INVESTIGATE] ' + JSON.stringify(data), e);
        }
    }

    pickup(data, socket) {
        try {
            let player = this.getPlayerBySocketId(socket.id);
            let region = this.getRegion(data.id);
            if (player.canPickUp(region, data.x, data.y, data.id)) {
                player.pickUp(region, data.x, data.y, data.id);
            } else {
                this.logger.verbose('[PICKUP] Invalid ' + JSON.stringify(data));
            }
        } catch (e) {
            this.logger.error('[PICKUP] ' + JSON.stringify(data), e);
        }
    }

    drop(data, socket) {
        try {
            let player = this.getPlayerBySocketId(socket.id);
            let region = this.getRegion(data.id);
            if (player.canDrop(region, data.x, data.y, data.id)) {
                player.drop(region, data.x, data.y, data.id);
            } else {
                this.logger.verbose('[DROP] Invalid ' + JSON.stringify(data));
            }
        } catch (e) {
            this.logger.error('[DROP] ' + JSON.stringify(data), e);
        }
    }

};

module.exports = World;