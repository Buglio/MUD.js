const move_flavors = ["You run", "You walk", "You stumble", "..."]

function moveNorth(world, message_data, user, users, chat, io) {
    message_data.sender = "MOVE";
    message_data.body = move_flavors[0] + " north."

    // move the user's character
    user.moveNorth(world)
    
    chat.push(message_data);
    user.socket.emit("chat_update", message_data);
}

module.exports = {
    moveNorth,
}