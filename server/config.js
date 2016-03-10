'use strict';

module.exports = {

    environment: {
        name:    process.env.NODE_ENV    || 'development',
        port:    process.env.PORT_SERVER || 8888,
        verbose: process.env.verbose     || true
    },

    player: {
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