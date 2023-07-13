class Room {
    constructor(x, y, description, items, entities, doors) {
        this.x = x;
        this.y = y;
        this.description = description;
        this.items = items;
        this.entities = entities;
        this.doors = doors;
    }

    getPos() {
        return (this.x, this.y);
    }

    getEntities() {
        return this.entities;
    }
    removeItemFromRoom(id){
        for (let item of this.items){
            if (item.id == id){
                this.items.splice(this.items.indexOf(item), 1);
                return item
            }
        }
        return null
    }
}

module.exports = {
    Room,
    
}