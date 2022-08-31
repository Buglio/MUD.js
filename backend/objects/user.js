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

    // Room stuff
    getRoom() {
        return this.getCurrentCharacter().room;
    }
    setRoom(room) {
        this.characters[this.current_character].room = room;
    }

    // Movement
    moveNorth(world){
        this.setRoom(world.getRoom(this.getRoom().x, this.getRoom().y + 1));
    }
    moveSouth(world){
        this.setRoom(world.getRoom(this.getRoom().x, this.getRoom().y - 1));
    }
    moveEast(world){
        this.setRoom(world.getRoom(this.getRoom().x + 1, this.getRoom().y));
    }
    moveWest(world){
        this.setRoom(world.getRoom(this.getRoom().x - 1, this.getRoom().y));
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