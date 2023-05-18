class User {
    constructor(user_id, username, socket, auth_token) {
        this.user_id = user_id;
        this.socket = socket;
        this.characters = [];
        this.current_character = null;
        this.username = username;
        this.auth_token = auth_token;
    }

    checkAuthToken(auth_token) { 
        return auth_token === this.auth_token; 
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

    // Room stuff
    getRoom() {
        return this.getCurrentCharacter().room;
    }
    setRoom(room) {
        this.characters[this.current_character].room = room;
    }

    // Movement
    moveNorth(world){
        let room = world.getRoom(this.getRoom().x, this.getRoom().y - 1)
        // console.log(world.getRoom(this.getRoom().x, this.getRoom().y + 1));
        // console.log(world.map);
        if (room) {
            this.setRoom(room);
            return true;
        } 
        else { // No world coordinate there, sorry
            return false;
        }
    }
    moveSouth(world){
        let room = world.getRoom(this.getRoom().x, this.getRoom().y + 1)  
        if (room) {
            this.setRoom(room);
            return true;
        } 
        else { // No world coordinate there, sorry
            return false;
        }
    }
    moveEast(world){
        let room = world.getRoom(this.getRoom().x + 1, this.getRoom().y)  
        if (room) {
            this.setRoom(room);
            return true;
        } 
        else { // No world coordinate there, sorry
            return false;
        }
    }
    moveWest(world){
        let room = world.getRoom(this.getRoom().x - 1, this.getRoom().y)  
        if (room) {
            this.setRoom(room);
            return true;
        } 
        else { // No world coordinate there, sorry
            return false;
        }
    }

    // Character stuff
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

module.exports = {
    User,
    
}