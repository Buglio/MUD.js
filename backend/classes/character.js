const items_dict = require("../entities/items").dictionary;

class Character {
    constructor(name) {
        this.name = name;
        this.stats = {
            str: 10,
            con: 10,
            wis: 10,
            int: 10,
            dex: 10,
            cha: 10
        };
        this.hp = {
            max: 10,
            current: 10
        };
        this.mp = {
            max: 10,
            current: 10
        };
        this.xp = {
            max: 1000,
            current: 10
        }
        this.room = null;
        this.inventory = [];
        this.known_items = []; // array of known item ids
        this.inventory_size = 24

    }
    addItemToInventory(item){
        // TODO: check to see if item is over weight limit

        if (this.inventory.length == 0){
            // no items in inventory, just add.
            this.inventory.push(item)
        }
        else{
            for (let x = 0; x < this.inventory.length; x++){
                console.log(this.inventory[x].id, item.id);
                if (this.inventory[x].id == item.id){
                    console.log('item already exists in inventory');
                    // item already exists in inventory, try to add to stack
                    if (this.inventory[x].current_quantity < this.inventory[x].max_quantity){
                        // stack is not full, add to stack
                        this.inventory[x].current_quantity += 1;
                        return true;
                    }
                }
            }
            console.log('item does not exist in inventory');
            // item does not exist in inventory, add to new stack
            // check to see if item fits in inventory
            if (this.inventory_size > this.inventory.length){
                this.inventory.push(item)
                return true;
            }else{
                //TODO: item doesnt fit in inventory
                return false;
            }
        }
        
    }

    equipItem(item) {
        // check weight of item against strength of character
        // if below threshold, can't equip, if barely over threshold, it isn't effective
    }

    holdItem(item) {
        // check weight of item against strength of character
        // if below threshold, can't hold, if barely over threshold, reduces maneuverability (can't walk?)
    }

    
}

module.exports = {
    Character,
}