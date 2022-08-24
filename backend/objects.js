// TODO: should usernames only be used to login? 
//       if so, then it should be character data that we shuffle around the world, rather than users

class User {
    constructor(user_id, username, socket) {
        this.user_id = user_id;
        this.socket = socket;
        this.characters = [];
        this.current_character = null;
        this.username = username;
    }
    setUsername(username) {
        this.username = username;
    }
    emitUser() {
        return {
            user_id: this.user_id,
            characters: this.characters,
            current_character: this.current_character,
            username: this.username
        }
    }
    setRoom(room) {
        this.characters[this.current_character]["room"] = room;
    }
    addCharacter(char){
        this.characters.push(char);
        this.current_character = this.characters.length - 1;
    }
    getCurrentCharacter(){
        return this.characters[this.current_character];
    }
    setCurrentCharacter(char){
        this.characters[this.current_character] = char;
    }
}

class Character {
    constructor(name) {
        this.name = name;
        this.stats = {
            str: 15,
            con: 12,
            wis: 10,
            int: 12,
            dex: 13,
            cha: 16
        };
        this.hp = {
            max: 10,
            current: 10
        };
        this.room = null;
    }
    moveSouth(world){
        this.room = world.getRoom(this.room.x, this.room.y + 1);
    }
}

class World {
    constructor() {
        this.map = {};
    }
    addRoom(room) {
        if (!this.map[room.x]){
            this.map[room.x] = {};
            this.map[room.x][room.y] = room;
        }
            
    }
    removeRoom(room) {
        this.map[room.x].splice(room.y, 1);
    }
    getRoom(x,y){
        return this.map[x][y];
    }
}

class Room {
    constructor(x, y, description) {
        this.x = x;
        this.y = y;
        this.description = description;
        this.users = []; // TODO: should this be a list of users, or of characters? hmm... there are tradeoffs to both
        this.entities = []; // characters could be entities too...?
    }

    *getUsers() {
        for (const user of this.users) {
            yield user;
        }
    }

    // TODO: this should be changed to character once that system is ready
    addUser(user) {
        this.users.push(user);
    }

    // TODO: same here
    removeUser(user) {
        const index = this.users.indexOf(user)
        if (index > -1) {
            this.users.splice(index, 1);
        }
    }

    *getEntities() {
        for (const entity of this.entities) {
            yield entity;
        }
    }
}

// class RoomTile {
//     constructor(x, y) {
//         this.x = x
//         this.y = y
//     }

//     *getUsers() {
//         for (const user of this.users) {
//             yield user;
//         }
//     }

//     *getEntities() {
//         for (const entity of this.entities) {
//             yield entity;
//         }
//     }
// }

class ChatMessage {
    constructor(color, body, sender, timestamp) {
        this.color = color;
        this.body = body;
        this.sender = sender;
        this.timestamp = timestamp;
    }
}

module.exports = {
    User,
    Character,
    ChatMessage,
    World,
    Room,
    
}