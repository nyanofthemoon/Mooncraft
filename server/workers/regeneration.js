'use strict';

let Promise = require('bluebird');

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
        if (!this.last) {
            this._run();
        }
    }

    _run() {
        this.last = {
            'id'  : 1,  // @TODO Currently Hardcoded to Region 1
            'data': {}  // @TODO Define region data
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

    notify(socket, data) {
        socket.to(data.id).emit('query', data);
        return data;
    }

};

module.exports = Regeneration;