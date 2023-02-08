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

    // TODO: Mad sus, this getter is modifying state
    // Should be done whenever we create the world (via editor)
    getRoom(x,y){
        if (this.map[x] && this.map[x][y]) {
            let room = this.map[x][y]
            // check if there are doors
            if (this.map[x][y+1]) { // door up
                room.doors.n = true
            }
            if (this.map[x][y-1]) { // door down
                room.doors.s = true
            }
            if(this.map[x-1]){
                if (this.map[x-1][y]) { // door left
                    room.doors.w = true
                }
            }
            if(this.map[x+1]){
                if (this.map[x+1][y]) { // door right
                    room.doors.e = true
                }
            }

            return room;
        }
        
        return undefined; // SUS
    }
    getStartRoom(){
        return this.getRoom(0,0);
    }
}

module.exports = {
    World,
    
}