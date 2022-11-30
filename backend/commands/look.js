function process(message_data, user, users, chat, io) {
    console.log("LOOK command");
    let room = user.getCurrentCharacter().room
    message_data.sender = "LOOK";
    message_data.body = room.description;
    if (room.items.length == 0) {
        message_data.body = room.description + " There is nothing in the room.";
    }
    else {
        message_data.body += " The room contains ";
        let roomitems = {};

        for (var i of room.items) {
            if (i.visibility){
                if (i.id in roomitems) { // check if we already have one of that item
                    roomitems[i.id].quantity += i.current_quantity; // add quantity
                } 
                else { // add new item to output dict
                    let item = {
                        text: i.appearance,
                        quantity: i.current_quantity
                    };
                    if (i.visibility < 0.1){            // TODO: work on this maybe?
                        item.text = "Indeterminant Item"
                    }
                    roomitems[i.id] = item;
                }
            }
        }
        // build message more better
        for (const [key, value] of Object.entries(roomitems)) {
            message_data.body += value.text + " (" + value.quantity +"), ";
        }
        message_data.body = message_data.body.slice(0, -2);
        message_data.body += ".";
        if (Object.keys(roomitems).length === 0){ 
            message_data.body = room.description + " There is nothing in the room?"; 
        }
    }
    
    chat.push(message_data);
    user.socket.emit("chat_update", message_data);
    user.socket.emit("user_update", user.emitUser());
}

module.exports = {
    process,

}