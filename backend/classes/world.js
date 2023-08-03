const { Room } = require("./room");
const item = require('../classes/item');

class World {
    constructor(filename) {
        const loaded_world = require(`../${filename}`);

        this.map = {};
        this.items = {};
        
        // load the items
        for (let [itemId,itemObj] of Object.entries(loaded_world.items)){
            let newItem = new item.Item({
                "name": itemObj.name,
                "id": itemId,
                "appearance": itemObj.appearance,
                "visibility": itemObj.visibility,
                "description": itemObj.description,
                "sprite": itemObj.sprite,
                "volume": itemObj.volume,
                "weight": itemObj.weight,
                "max_quantity": itemObj.max_quantity,
                "rarity": itemObj.rarity,
                "is_shark": false
            });
            this.items[itemId] = newItem;
        }

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
                let roomItems = [];
                for (let item of room.items){
                    roomItems.push(this.items[item])
                }
                this.map[x][y] = new Room(room.x, room.y, room.description, roomItems, room.entities, room.doors);
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