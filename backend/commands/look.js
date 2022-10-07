function process(message_data, user, users, chat, io) {
    let room = user.getCurrentCharacter().room
    message_data.sender = "LOOK";
    message_data.body = room.description;
    if (room.items.length == 0) {
        message_data.body = "There is nothing in the room.";
    }
    else {
        message_data.body += " The room contains " + room.items[0].name;
    }
    
    chat.push(message_data);
    user.socket.emit("chat_update", message_data);
}

module.exports = {
    process,

}