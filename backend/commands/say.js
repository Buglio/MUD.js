function process(message_data, user, users, chat, io) {
    message_data.sender = user.username;
    chat.push(message_data);

    for (const username in users) {
        let userObj = users[username];
        
        if (userObj == null) return
        let room = userObj.getCurrentCharacter().room
        if (room.getPos() == user.getCurrentCharacter().room.getPos()) {
            userObj.socket.emit("chat_update", message_data);
        }
    }
}

module.exports = {
    process,

}