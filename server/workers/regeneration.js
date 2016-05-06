'use strict';

let Logger = require('./../modules/logger');
let Region = require('./../modules/region');
let Node   = require('./../modules/node');

const emptySpaceNodeId  = 1;
const radiatedNodeIds   = [100, 101, 102];
const minRadiatedNodeId = Math.min.apply(Math, radiatedNodeIds);
const maxRadiatedNodeId = Math.max.apply(Math, radiatedNodeIds);

class Regeneration {

    constructor(config, store) {
        this.logger         = new Logger('WORKER [REGENERATION]', config);
        this.store          = store;
        this.namespace      = 'regeneration';
        this.interval       = 1440 * (60 * 1000); // Runs every 1440 minutes
        this.saveDelay      = 10 * 1000;          // 10 seconds
        this.originRegionId = config.player.originRegionId;
    }

    start() {
        var self = this;
        setInterval(function() { self._run.call(self); }, this.interval);
    }

    _run() {
        this.store.publish('system', JSON.stringify({type: 'save-regions'}));
        var that = this;
        setTimeout(function() {
            Region.findAllIds(that.store).then(function(regionsIds) {
                regionsIds.forEach(function(regionId) {
                    Region.findOne(that.store, regionId).then(function(region) {
                        try {
                            region               = JSON.parse(region);
                            let regenerationData = region.fixture.regeneration;
                            if (regenerationData) {
                                let newRegion = new Region();
                                newRegion.initialize(null, null, region);

                                // Process Nodes
                                let radiationChance = regenerationData.radiation || null;
                                newRegion.data.progress.nodes = [];
                                newRegion.nodes.forEach(function (y, yIndex) {
                                    y.forEach(function (x, xIndex) {
                                        let xTile = newRegion.getTile(xIndex, yIndex);
                                        if (xTile.isWalkable()) {
                                            if (radiationChance == Math.floor((Math.random() * 100))) {
                                                if (radiatedNodeIds.indexOf(x.getId()) == -1) {
                                                    if (!x.isOwnable()) {
                                                        x.mutate(minRadiatedNodeId);
                                                    }
                                                } else {
                                                    let incrementedRadiationId = x.getId() + 1;
                                                    if (incrementedRadiationId <= maxRadiatedNodeId) {
                                                        x.mutate(incrementedRadiationId);
                                                    }
                                                }
                                            }
                                            if (emptySpaceNodeId != x.getId()) {
                                                newRegion.data.progress.nodes.push(_formatNode(x, xIndex, yIndex));
                                            }
                                        }
                                    });
                                });

                                // Process Items
                                newRegion.data.progress.items = [];

                                // Publish
                                that.publish({
                                    'id'  : regionId,
                                    'data': newRegion.data
                                });
                            }
                        } catch (e) {
                            that.logger.error('Error occured while regenerating ' + regionId, e);
                        }
                    });
                });
            });
        }, that.saveDelay);
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

function _formatNode(node, x, y) {
    node.data.x  = x;
    node.data.y  = y;
    delete node.data.description;
    delete node.data.name;
    delete node.data.icon;
    return node.data;
}

module.exports = Regeneration;