// TODO: should usernames only be used to login? 
//       if so, then it should be character data that we shuffle around the world, rather than users

class Session {
    constructor(socket) {
        this.socket = socket;
        this.socket_id = socket.id;
    }
}

class User {
    room = null // TODO: move this to character once that system is ready
    constructor(user_id, username, session) {
        this.user_id = user_id;
        this.session = session;
        this.characters = [];
        this.username = username;
    }

    // TODO: move this function to character once that system is ready
    setRoom(room) {
        this.room = room;
    }
}

class Character {
    constructor(name) {
        this.name = name;
        this.user = null;
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
        this.room = {
            x: 0,
            y: 0
        };
    }

    setUser(user) {
        this.user = user;
    }
    
}

class World {
    constructor() {
        this.map = [[]];
    }

    addRoom(room) {
        this.map[room.x][room.y] = room;
    }

    removeRoom(room) {
        this.map[room.x].splice(room.y, 1);
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
    Session,
    User,
    Character,
    ChatMessage,
    World,
    Room,
    
}