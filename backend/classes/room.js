class Room {
    constructor(x, y, description) {
        this.x = x;
        this.y = y;
        this.description = description;
        this.items = [];
        this.entities = []; // monsters, whatever idk
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