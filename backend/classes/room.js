class Room {
    constructor(x, y, description) {
        this.x = x;
        this.y = y;
        this.description = description;
        this.items = [];
        this.entities = []; // monsters, whatever idk
        this.doors = { // set in getRoom
            n: false,
            s: false,
            e: false,
            w: false
        }
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