'use strict';

let Logger = require('./../modules/logger');
let Cycle  = require('./helpers/cycle');

class Cycling {

    constructor(config, store) {
        this.logger    = new Logger('WORKER [CYCLING]', config);
        this.store     = store;
        this.namespace = 'cycling';
        this.interval  = 5 * (60 * 1000); // Runs every 5 minutes
        this.data      = {
            cycle: Cycle.evaluate()
        };
    }

    initialize(data) {
        var that = this;
        Object.keys(data).forEach(function(key) {
            that.data[key] = data[key];
        });
    }

    start() {
        var self = this;
        setInterval(function() { self._run.call(self); }, this.interval);
        if (!this.data.cycle) {
            this._run();
        }
    }

    _run() {
        let cycle = Cycle.evaluate();
        if (cycle != this.data.cycle) {
            this.data.cycle = cycle;
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

    query() {
        var struct = {
            'type': this.namespace,
            'data': {
                'cycle': this.data.cycle
            }
        };

        return struct;
    }

    notify(socket) {
        socket.emit('query', this.query());
    }

};

module.exports = Cycling;