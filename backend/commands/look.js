function process(message_data, user, users, chat, io) {
    console.log("LOOK command");
    let room = user.getCurrentCharacter().room
    message_data.sender = "LOOK";
    message_data.body = room.description;
    // the room has no items
    if (room.items.length == 0) {
        message_data.body = room.description + " There is nothing in the room.";
    }
    // the room has items
    else {
        message_data.body += " The room contains ";
        let roomitems = {};

        for (var i of room.items) {
            console.log(i);
            if (i.visibility){
                if (i.id in roomitems) { // check if we already have one of that item
                    roomitems[i.id].quantity += i.current_quantity; // add quantity
                } 
                // TODO: refactor to getter on the item (is passed a player with passive visibility)
                // This means the visibility property should be removed from items
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
        // append name of item and quanitity to message body
        for (const [key, value] of Object.entries(roomitems)) {
            message_data.body += value.text + " (" + value.quantity +"), ";
        }
        
        // chop off the last comma and add a period
        message_data.body = message_data.body.slice(0, -2);
        message_data.body += ".";
        
        // if there are items but they're not visible
        if (Object.keys(roomitems).length === 0){ 
            message_data.body = room.description + " There is nothing in the room?"; 
        }

        // give information about doors
        message_data.body += " This room has exits to the ";

        let doors = room.doors;
        let doors_msg = [];
        if (doors.n) {
            doors_msg.push("north");
        }
        if (doors.s) {
            doors_msg.push("south");
        }
        if (doors.e) {
            doors_msg.push("east");
        }
        if (doors.w) {
            doors_msg.push("west");
        }

        if (doors_msg.length > 1) {
            doors_msg[doors_msg.length-1] = "and " + doors_msg[doors_msg.length-1];
        }

        if (doors_msg.length === 2) {
            message_data.body += doors_msg.join(" ");

        } else {
            message_data.body += doors_msg.join(", ");
        }

        message_data.body += "."
    }
    
    chat.push(message_data);
    user.socket.emit("chat_update", message_data);
    user.socket.emit("user_update", user.emitUser());
}

module.exports = {
    process,

}