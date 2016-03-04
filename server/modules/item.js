'use strict';

let FixtureClient = require('./../db/fixture/client');
const FIXTURES    = FixtureClient.readItems();

class Item {

    constructor(id) {
        this.data    = Item.getTypeDefinition(id);
        this.data.id = id;
        this.data.x  = null;
        this.data.y  = null;
    }

    static getTypeDefinition(id) {
        return FIXTURES[id];
    }

    getName() {
        if (this.isSingular()) {
            return this.data.name.singular;
        } else {
            return this.data.name.plural;
        }
    }

    getDescription() {
        if (this.isSingular()) {
            return this.data.description.singular;
        } else {
            return this.data.description.plural;
        }
    }

    getQuantity() {
        return this.data.quantity;
    }

    getUnitValue() {
        return this.data.price;
    }

    getUnitWeight() {
        return this.data.weight;
    }

    getTotalValue() {
        return this.data.quantity * this.data.price;
    }

    getTotalWeight() {
        return this.data.quantity * this.data.weight;
    }

    isSingular() {
        if (this.data.quantity <= 1) {
            return true;
        } else {
            return false;
        }
    }

    isWalkable() {
        if (this.data.walkable) {
            if (this.isSingular()) {
                return this.data.walkable.singular;
            } else {
                return this.data.walkable.plural;
            }
        }

        return false;
    }

    isPickable() {
        if (this.data.pickable == true) {
            return true;
        } else {
            return false;
        }
    }

    isDroppable() {
        if (this.data.droppable == true) {
            return true;
        } else {
            return false;
        }
    }

    isConsummable() {
        if (this.data.consummable == true) {
            return true;
        } else {
            return false;
        }
    }

    isContainable() {
        if (this.data.containable == true) {
            return true;
        } else {
            return false;
        }
    }

    isInvisible() {
        if (this.data.invisible == true) {
            return true;
        } else {
            return false;
        }
    }

    mutate(id, data) {
        this.data = Item.getTypeDefinition(id);
        if (data) {
            var that = this;
            Object.keys(data).forEach(function(key) {
                that.data[key] = data[key];
            });
        }
    }

    query() {
        return {
            'type': 'item',
            'data': {
                'id'         : this.data.id,
                'name'       : this.data.name,
                'description': this.data.description,
                'icon'       : this.data.icon,
                'price'      : this.data.price,
                'quantity'   : this.data.quantity
            }
        };
    }

};

module.exports = Item;