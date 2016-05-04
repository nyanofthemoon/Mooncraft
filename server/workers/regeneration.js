'use strict';

let Logger = require('./../modules/logger');
let Region = require('./../modules/region');

class Regeneration {

    constructor(config, store) {
        this.logger         = new Logger('WORKER [REGENERATION]', config);
        this.store          = store;
        this.namespace      = 'regeneration';
        this.interval       = 1440 * (60 * 1000); // Runs every 1440 minutes
        this.originRegionId = config.player.originRegionId;
    }

    start() {
        var self = this;
        setInterval(function() { self._run.call(self); }, this.interval);
    }

    _run() {
        var that = this;
        Region.findAllIds(this.store).then(function(regionsIds) {
            regionsIds.forEach(function(regionId) {
                if (regionId != that.originRegionId) {
                    Region.findOne(that.store, regionId).then(function(data) {
                        /*
                         data         = {
                         'id'         : null,
                         'name'       : null,
                         'description': null,
                         'fixture'    : {},
                         'progress'    : {
                         'nodes': [],
                         'items': []
                         }
                         };
                         */
                        /*
                        that.publish({
                            'id'  : regionId,
                            'data': data
                        });
                        */
                    });
                }
            });
        });
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
        socket.to(region.getId()).emit('query', {type: this.namespace, data: region.query() });
    }

};

module.exports = Regeneration;