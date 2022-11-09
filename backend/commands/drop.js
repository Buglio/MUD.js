function process(message_data, user, users, chat, io) {
    console.log("DROP command");
    let room = user.getCurrentCharacter().room;
    let body = message_data.body;
    message_data.sender = "DROP";

    let inventory = user.getCurrentCharacter().inventory;

    if (body == "") { 
        message_data.body = "Specify something to drop!";
    }
    else if (inventory.length == 0) {
        message_data.body = "You have nothing in your inventory!";
    } else {
        // find items in the inventory with names matching the provided substring
        let matching_indices = [];
        for (let i = 0; i < inventory.length; i++) {
            item = inventory[i];
            if (item.name.toLowerCase().includes(body.toLowerCase())) {
                matching_indices.push(i);
            }
        }
        if (matching_indices.length == 0) {
            message_data.body = `You have no \"${body}\" in your inventory.`;
        }
        else if (matching_indices.length > 1) {
            let itemToDrop = inventory[matching_indices[0]];
            message_data.body = "You dropped one "+itemToDrop.name+".";
            if (itemToDrop.current_quantity > 1) {
                itemToDrop.current_quantity--;
                let droppedItem = JSON.parse(JSON.stringify(itemToDrop));
                droppedItem.current_quantity = 1;
                room.items.push(droppedItem);
            } else {
                room.items.push(inventory[matching_indices[0]]);
                inventory.splice(matching_indices[0], 1);
            }
        }
        // TODO: figure out this ghastly else scenario
    }
    
    chat.push(message_data);
    user.socket.emit("chat_update", message_data);
    user.socket.emit("user_update", user.emitUser());
}

module.exports = {
    process,

}