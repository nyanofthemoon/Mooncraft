'use strict';

module.exports = {

    environment: {
        name:    process.env.NODE_ENV    || 'development',
        port:    process.env.PORT        || 8888,
        verbose: process.env.VERBOSE     || true
    },

    player: {
        salt            : process.env.PLAYER_SALT      || '!pur1n+',
        originRegionId  : process.env.REGION_ORIGIN_ID || 'T0',
        originRegionX   : process.env.REGION_ORIGIN_X  || 1,
        originRegionY   : process.env.REGION_ORIGIN_Y  || 1,
        defaultName     : 'Unnamed',
        defaultIcon     : 'players/leaf.gif',
        defaultInventory: {}
    },

    // See https://www.npmjs.com/package/redis
    redis: {
        url:     process.env.REDIS_URL || 'redis://127.0.0.1:6379',
        options: {}
    }

}