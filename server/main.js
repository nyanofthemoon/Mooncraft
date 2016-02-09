'use strict';

const CONFIG = require('./config');

let io = require('socket.io')();

let World  = require('./modules/world');
let Player = require('./modules/player');
let logger = new (require('./modules/logger'))('SERVER [WEBSOCKET]', CONFIG);

World.initialize(io, CONFIG).then(function(world) {
    io.sockets.on('connection', function(socket) {
        logger.info('Socket Connected', socket.id);

        if (socket.handshake.query.name && socket.handshake.query.pass) {
            let playerId = socket.handshake.query.name + '-' + socket.handshake.query.pass;
            let player   = world.getPlayer(playerId);
            if (!player) {
                player = new Player(CONFIG);
                player.initialize(socket, world.source, {
                    'name': socket.handshake.query.name,
                    'pass': socket.handshake.query.pass
                });
                world.addPlayer(player);
                logger.info('Creating New Player ' + playerId, socket.id);
            } else {
                player.socket = socket;
            }

            world.data.sessions[socket.id] = playerId;
            world.bindSocketToModuleEvents(socket);
        }

        socket.on('disconnect', function() {
            let player = world.getPlayerBySocketId(this.id);
            delete(world.data.sessions[this.id]);
            if (player && player.isActive()) {
                player.resetActivity();
                player.save();
            }

            logger.info('Socket Disconnected', this.id);
        });
    });

    let port = CONFIG.environment.port;
    try {
        io.listen(port);
        logger.success('Listening on port ' + port);
    } catch (e) {
        logger.error('Not listening on port ' + port, e);
    }

})
.catch(function(reason) {
    logger.error('World Initialization Failure', reason);
});