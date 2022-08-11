class Session {
    constructor(socket) {
        this.socket = socket;
        this.socket_id = socket.id;
        ;
    }
}

class User {
    constructor(user_id, username, session) {
        this.user_id = user_id;
        this.session = session;
        this.characters = [];
        this.name = username;
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
    }

    setUser(user) {
        this.user = user
    }
    
}
module.exports = {
    Session,
    User,
    Character
}