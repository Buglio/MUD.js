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
}

module.exports = {
    Room,
    
}