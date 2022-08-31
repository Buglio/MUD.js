function process(message_data, user, users, chat, io) {
    let room = user.getCurrentCharacter().room
    message_data.sender = "LOOK";
    message_data.body = room.description
    message_data.body += " The room contains " + room.items[0].name // will crash if no items
    
    chat.push(message_data);
    user.socket.emit("chat_update", message_data);
}

module.exports = {
    process,

}