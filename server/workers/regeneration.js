'use strict';

let Logger = require('./../modules/logger');

class Regeneration {

    constructor(config, store) {
        this.logger    = new Logger('WORKER [REGENERATION]', config);
        this.store     = store;
        this.namespace = 'regeneration';
        this.interval  = 1440 * (60 * 1000); // Runs every 1440 minutes
        this.last      = null;
    }

    start() {
        var self = this;
        setInterval(function() { self._run.call(self); }, this.interval);
    }

    _run() {
        this.last = {
            'id'  : 'F0', // @TODO Currently Hardcoded to Region F0
            'data': {}    // @TODO Define region data
        };
        this.publish(this.last);
    }

    publish(data) {
        try {
            this.store.publish(this.namespace, JSON.stringify(data));
            this.logger.info('Notified channel', data);
        } catch (e) {
            this.logger.error('Could not notify channel', e);
        }
    }

    subscribe(client) {
        try {
            client.subscribe(this.namespace);
            this.logger.info('Subscribed to channel', this.namespace);
        } catch (e) {
            this.logger.error('Could not subscribe to channel', e);
        }
    }

    notify(socket, region) {
        socket.to(region.getId()).emit(this.namespace, region.query());
    }

    say(region, message) {
        region.socket.to(region.getId()).emit('say', {
            name   : this.getName(),
            message: message
        });
    }

};

module.exports = Regeneration;