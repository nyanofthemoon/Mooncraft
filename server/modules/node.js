'use strict';

const FIXTURES = {
    0: {
        "name"         : "Unclaimed Space",
        "icon"         : "node/space",
        "description"  : "An empty space.",
        "walkable"     : true,
        "harvestable"  : false,
        "buildable"    : true,
        "ownable"      : false,
        "transportable": false
    },
    1: {
        "name"         : "Teleport",
        "icon"         : "node/teleport",
        "description"  : "A teleport to another region.",
        "walkable"     : true,
        "harvestable"  : false,
        "buildable"    : false,
        "ownable"      : false,
        "transportable": {
            "region": null,
            "x"     : null,
            "y"     : null
        }
    },
    2: {
        "name"         : "Tree",
        "icon"         : "node/tree",
        "description"  : "A tall tree.",
        "walkable"     : false,
        "harvestable"  : {
            "item"     : 1,
            "quantity" : 2,
            "transform": 2
        },
        "buildable"    : false,
        "ownable"      : false,
        "transportable": false
    },
    3: {
        "name"         : "Tree Stump",
        "icon"         : "node/tree-stump",
        "description"  : "What remains of a once proud tree.",
        "walkable"     : false,
        "harvestable"  : {
            "item"     : 1,
            "quantity" : 1,
            "transform": 0,
        },
        "buildable"    : false,
        "ownable"      : false,
        "transportable": false
    },
    4: {
        "name"         : "Wood Fence",
        "icon"         : "node/wood-fence",
        "description"  : "A wooden fence built by someone.",
        "walkable"     : false,
        "harvestable"  : false,
        "buildable"    : false,
        "ownable"      : {
            "owner": null,
            "date" : null
        },
        "transportable": false
    }
};

class Node {

    constructor(id) {
        this.data    = Node.getTypeDefinition(id);
        this.data.id = id;
        this.data.x  = null;
        this.data.y  = null;
    }

    static getTypeDefinition(id) {
        return FIXTURES[id];
    }

    getName() {
        return this.data.name;
    }

    getDescription() {
        return this.data.description;
    }

    isWalkable() {
        if (this.data.walkable && this.data.walkable == true) {
            return true;
        } else {
            return false;
        }
    }

    isTransportable() {
        if (this.data.transportable && this.data.transportable == true) {
            return true;
        } else {
            return false;
        }
    }

    isOwnable() {
        if (this.data.ownable && this.data.ownable == true) {
            return true;
        } else {
            return false;
        }
    }

    isOwnedBy(player) {
        if (this.data.ownable && this.data.ownable.owner == player.name) {
            return true;
        } else {
            return false;
        }
    }

    isBuildable() {
        if (this.data.buildable && this.data.buildable == true) {
            return true;
        } else {
            return false;
        }
    }

    build() {
    }

    isHarvestable() {
        if (this.data.harvestable && this.data.harvestable.quantity > 0) {
            return true;
        } else {
            return false;
        }
    }

    harvest() {
        this.harvestable.quantity--;
        if (this.harvestable.quantity < 1) {
            if (this.harvestable.transform) {
                transform(this.harvestable.transform);
            }
        }
    }

    mutate(id, data) {
        this.data = Node.getTypeDefinition(id);
        if (data) {
            var that = this;
            Object.keys(data).forEach(function(key) {
                that.data[key] = data[key];
            });
        }
    }

};

module.exports = Node;