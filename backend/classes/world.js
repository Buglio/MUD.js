const { Room } = require("./room");

class World {
    constructor(filename) {
        const loaded_world = require(`../${filename}`);

        this.map = {};
        // this.items = loaded_world.items;
        // this.entities = loaded_world.entities;

        // load the map
        this.startingRoomCoords = null;
        for (let [x, x_rooms] of Object.entries(loaded_world.map)) {
            for (let [y, room] of Object.entries(x_rooms)) {
                console.log(x, y);
                if (this.startingRoomCoords === null) {
                    this.startingRoomCoords = {x: x, y: y};
                }
                if (this.map[x] == undefined) {
                    this.map[x] = {};
                }
                this.map[x][y] = new Room(room.x, room.y, room.description, room.items, room.entities, room.doors);
            }
        }
    }

    // loadWorld(filename)

    addRoom(room) {
        if (!this.map[room.x]){
            this.map[room.x] = {};
            this.map[room.x][room.y] = room;
        }
        else {
            this.map[room.x][room.y] = room;
        }
    }

    removeRoom(room) {
        this.map[room.x].splice(room.y, 1);
    }

    // TODO: Mad sus, this getter is modifying state
    // Should be done whenever we create the world (via editor)
    getRoom(x,y){
        if (this.map[x] && this.map[x][y]) {
            return this.map[x][y];
        }
        
        return undefined; // SUS
    }
    getStartRoom(){
        return this.getRoom(this.startingRoomCoords.x, this.startingRoomCoords.y);
    }
}

module.exports = {
    World,
    
}