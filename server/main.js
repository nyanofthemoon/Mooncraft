'use strict';

let io = require('socket.io')();

let app = require(__dirname + '/../client/main');

const CONFIG = require('./config');
let World    = require('./modules/world');
let Player   = require('./modules/player');
let logger   = new (require('./modules/logger'))('SERVER [WEBSOCKET]', CONFIG);

World.initialize(io, CONFIG).then(function(world) {
    io.sockets.on('connection', function(socket) {
        logger.info('Socket Connected', socket.id);

        if (socket.handshake.query.name && socket.handshake.query.pass) {
            let playerId = Player.getId(socket.handshake.query.name, socket.handshake.query.pass);
            let player   = world.getPlayer(playerId);
            if (!player) {
                player = new Player(CONFIG);
                player.initialize(socket, world.source, {
                    'name': socket.handshake.query.name,
                    'pass': socket.handshake.query.pass
                });
                world.addPlayer(player);
                let lastRegion = world.getRegion(player.getRegionId());
                if (lastRegion) {
                    player.enter(lastRegion);
                }
                logger.info('Creating New Player: ' + player.getName(), socket.id);
            } else {
                player.socket = socket;
            }

            world.data.sessions[socket.id] = playerId;
            world.bindSocketToModuleEvents(socket);
        }

        socket.on('disconnect', function() {
            let player = world.getPlayerBySocketId(this.id);
            delete(world.data.sessions[this.id]);
            if (player.isActive()) {
                player.resetActivity();
                player.save();
            }

            if (player.data.region.id) {
                let region = world.getRegion(player.data.region.id);
                player.leave(region);
            }

            logger.info('Socket Disconnected', this.id);
        });
    });

    try {
        if (CONFIG.environment.name === 'development') {
            io.listen(CONFIG.environment.port);
            logger.success('Listening on port ' + CONFIG.environment.port);
        } else {
            var server = require('http').createServer(app.app);
            io.listen(server);
            server.listen(CONFIG.environment.port, function () {
                app.logger.success('Listening on port ' + CONFIG.environment.port);
                logger.success('Listening on port ' + CONFIG.environment.port);
            });
        }
    } catch (e) {
        logger.error('Not listening on port ' + CONFIG.environment.port, e);
    }

})
.catch(function(reason) {
    logger.error('World Initialization Failure', reason);
});