'use strict';

let io      = require('socket.io')();
let Promise = require('bluebird');

let World  = require('./modules/world');
let config = require('./config');
let logger = new (require('./modules/logger'))('SERVER', config);

World.initialize(io).then(function(world) {

    io.on('connection', function(socket) {
        logger.verbose(socket.id + ' Connected');
        world.bindSocketToModuleEvents(socket);
        socket.on('disconnect', function() {
            logger.verbose(this.id + ' Disconnected');
        });
    });

    let port = config.environment.port;
    try {
        io.listen(port);
        logger.info('Listening on port ' + port);
    } catch (e) {
        logger.error('Not listening on port ' + port + ' ' + e);
    }

})
.catch(function(reason) {
    logger.error('World Initialization Failure ' + reason);
});