'use strict';

module.exports = {

    environment: {
        name:    process.env.NODE_ENV    || 'development',
        port:    process.env.PORT        || 8888,
        verbose: process.env.VERBOSE     || true
    },

    player: {
        salt            : process.env.PLAYER_SALT      || '!pur1n+',
        originRegionId  : process.env.REGION_ORIGIN_ID || 'CG',
        originRegionX   : process.env.REGION_ORIGIN_X  || 3,
        originRegionY   : process.env.REGION_ORIGIN_Y  || 3,
        defaultName     : 'Unnamed',
        defaultIcon     : 'player/default',
        defaultInventory: {}
    },

    // See https://www.npmjs.com/package/redis
    redis: {
        url:     process.env.REDIS_URL || 'redis://127.0.0.1:6379',
        options: {}
    }

}