'use strict';

let Logger = require('./../modules/logger');
let Cycle  = require('./helpers/cycle');

class Cycling {

    constructor(config, store) {
        this.logger    = new Logger('WORKER [CYCLING]', config);
        this.store     = store;
        this.namespace = 'cycling';
        this.interval  = 5 * (60 * 1000); // Runs every 5 minutes
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
        let cycle = Cycle.evaluate();
        if (cycle != this.last) {
            this.last = cycle;
            this.publish({
                cycle: cycle
            });
        }
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
        socket.emit('cycle', data);
    }

};

module.exports = Cycling;