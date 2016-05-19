'use strict';

const FIXTURES = require('./../db/fixture/items.json');

class Item {

    constructor(id) {
        this.mutate(id);
    }

    static getTypeDefinition(id) {
        return JSON.parse(JSON.stringify(FIXTURES[id]));
    }

    getId() {
        return this.data.id;
    }

    getName() {
        if (this.isSingular()) {
            return this.data.name.singular;
        } else {
            return this.data.name.plural;
        }
    }

    getIcon() {
        if (this.isSingular()) {
            return this.data.icon.singular;
        } else {
            return this.data.icon.plural;
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
        return this.data.quantity || 0;
    }

    getUnitValue() {
        return this.data.price || 0;
    }

    getUnitWeight() {
        return this.data.weight || 0;
    }

    getTotalValue() {
        return this.getQuantity() * this.getUnitValue();
    }

    getTotalWeight() {
        return this.getQuantity() * this.getUnitWeight();
    }

    isSingular() {
        if (this.getQuantity() <= 1) {
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
        this.data    = Item.getTypeDefinition(id);
        this.data.id = id;
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
                'id'         : this.getId(),
                'name'       : this.getName(),
                'icon'       : this.getIcon(),
                'description': this.getDescription(),
                'quantity'   : this.getQuantity(),
                'unitValue'  : this.getUnitValue(),
                'unitWeight' : this.getUnitWeight(),
                'totalValue' : this.getTotalValue(),
                'totalWeight': this.getTotalWeight(),
                'walkable'   : this.isWalkable(),
                'pickable'   : this.isPickable(),
                'droppable'  : this.isDroppable(),
                'consummable': this.isConsummable(),
                'containable': this.isContainable(),
                'invisible'  : this.isInvisible()
            }
        };
    }

};

module.exports = Item;