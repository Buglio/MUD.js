class World {
    constructor() {
        this.map = {};
    }
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

    getRoom(x,y){
        return this.map[x][y];
    }
    getStartRoom(){
        return this.map[0][0];
    }
}

module.exports = {
    World,
    
}