'use strict';

let Logger = require('./../modules/logger');
let Region = require('./../modules/region');
let Node   = require('./../modules/node');

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
                // @TODO Put the != back on... //
                // if (regionId != that.originRegionId) {
                if (regionId == that.originRegionId) {
                    Region.findOne(that.store, regionId).then(function(region) {
                        let newRegion = new Region();
                        newRegion.initialize(null, null, JSON.parse(region));

                        // @TODO Put back
                        //newRegion.data.progress.nodes = [];
                        //newRegion.data.progress.items = [];

                        newRegion.nodes.forEach(function (y, yIndex) {
                            y.forEach(function (x, xIndex) {
                                /* Example
                                if (yIndex == 2 && xIndex == 2) {
                                    x.mutate(102);
                                    x.data.id = 102;
                                    delete x.data.description;
                                    delete x.data.name;
                                    delete x.data.icon;
                                    x.data.x = xIndex;
                                    x.data.y = yIndex;
                                    newRegion.data.progress.nodes.push(x.data);
                                }
                                */
                            });
                        });
                        that.publish({
                            'id'  : regionId,
                            'data': newRegion.data
                        });
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
        socket.to(region.getId()).emit('query', {type: this.namespace, data: region.query().data });
    }

};

module.exports = Regeneration;