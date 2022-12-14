function process(message_data, user, users, chat, io) {
    console.log("GRAB command");
    let room = user.getCurrentCharacter().room;
    let body = message_data.body;

    message_data.sender = "GRAB";

    let character = user.getCurrentCharacter();

    if (room.items.length == 0) {
        message_data.body = "There is nothing in the room.";
    }
    // otherwise if there is one item and no command arguments
    else if (room.items.length == 1 && body == "") {
        message_data.body = "You grab the "+room.items[0].name+".";
        character.addItemToInventory(room.items.pop());
    }
    // more than one item and no argument was specified
    else if (room.items.length > 1 && body == "") {
        message_data.body = "Please be more specific.";
    }
    else {
        // find items in the room with names matching the provided substring
        let matching_indices = [];
        for (let i = 0; i < room.items.length; i++) {
            item = room.items[i];
            if (item.name.toLowerCase().includes(body.toLowerCase())) {
                matching_indices.push(i);
            }
        }
        if (matching_indices.length == 0) { // it's hitting this case no matter what body we pass in
            message_data.body = `Couldn't find item \"${body}\"`;
        }
        else if (matching_indices.length > 1) {
            message_data.body = "Please be more specific.";
            let allSameIds = matching_indices.map(i => room.items[i].id).reduce((a, b) => a == b);
            if (allSameIds) {
                message_data.body = "You grab the "+room.items[matching_indices[0]].name+".";
                character.addItemToInventory(room.items[matching_indices[0]]);
                room.items.splice(matching_indices[0], 1);
            }
        } else {
            message_data.body = "You grab the "+room.items[matching_indices[0]].name+".";
            character.addItemToInventory(room.items[matching_indices[0]]);
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