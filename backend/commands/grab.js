function process(message_data, user, users, chat, io) {
    console.log("GRAB command");
    let room = user.getCurrentCharacter().room;
    let body = message_data.body;

    message_data.sender = "GRAB";

    if (room.items.length == 0) {
        message_data.body = "There is nothing in the room.";
    }
    else if (room.items.length == 1 && body == "") {
        message_data.body = "You grab the "+room.items[0].name+".";
        user.getCurrentCharacter().inventory.push(room.items.pop());
    }
    else if (room.items.length > 1 && body == "") {
        message_data.body = "Please be more specific.";
    }
    else {
        // find items in the room with names matching the provided substring
        let matching_indices = [];
        for (let i; i < room.items.length; i++) {
            item = room.items[i];
            if (item.name.toLowerCase().contains(body.toLowerCase())) {
                matching_indices.push(i);
            }
        }
        if (matching_indices.length == 0) { // it's hitting this case no matter what body we pass in
            message_data.body = "Please be less specific.";
        }
        else if (matching_indices.length > 1) {
            message_data.body = "Please be more specific.";
        }
        else {
            message_data.body = "You grab the "+room.items[matching_indices[0]].name+".";
            user.getCurrentCharacter().inventory.push(matching_indices[0]);
            room.items.splice(matching_indices[0], 1);
        }
    }
    
    chat.push(message_data);
    user.socket.emit("chat_update", message_data);
    user.socket.emit("user_update", user.emitUser());
}

module.exports = {
    process,

}