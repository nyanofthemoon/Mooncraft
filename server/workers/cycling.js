'use strict';

let Promise = require('bluebird');

let Logger = require('./../modules/logger');
let Cycle  = require('./../modules/cycle');

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
        setInterval(function() { self.run.call(self); }, this.interval);
    }

    run() {
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
            this.logger.success('Notified channel of ' + this.last);
        } catch (e) {
            this.logger.error('Could not notify channel of ' + this.last + ' ' + e);
        }
    }

    subscribe(client) {
        try {
            client.subscribe(this.namespace);
            this.logger.verbose('Subscribed to ' + this.namespace);
        } catch (e) {
            this.logger.error('Could not subscribe to ' + this.namespace);
        }
    }

    handle(socket, data) {
        socket.emit('cycle', data);
    }

};

module.exports = Cycling;