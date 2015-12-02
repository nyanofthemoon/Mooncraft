module.exports = {

    environment: {
        name: process.env.NODE_ENV    || 'development',
        port: process.env.PORT_SERVER || 8888
    },

    // See https://www.npmjs.com/package/redis
    redis: {
        url:     process.env.REDIS_URL || 'redis://127.0.0.1:6379',
        options: {}
    }

}