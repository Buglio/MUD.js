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
                        text: i.name,
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
    }

    // give information about doors
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

    if (doors_msg.length == 0) {
        message_data.body += " This room has no exits! Oh no!!";
    } else if (doors_msg.length > 1) {
        message_data.body += " This room has exits to the ";
        doors_msg[doors_msg.length-1] = "and " + doors_msg[doors_msg.length-1];
    } else {
        message_data.body += " This room has an exit to the ";
    }


    if (doors_msg.length === 2) {
        message_data.body += doors_msg.join(" ");

    } else {
        message_data.body += doors_msg.join(", ");
    }

    if (doors_msg.length > 0) {
        message_data.body += ".";
    }
    
    chat.push(message_data);
    user.socket.emit("chat_update", message_data);
    user.socket.emit("user_update", user.emitUser());
}

module.exports = {
    process,

}

// // Define a function named 'process' that takes 4 parameters: messageData, user, chat, io.
// function process(messageData, user, users, chat, io) {
//     // Get the user's current room and log it.
//     console.log(user);
//     let room = user.getCurrentCharacter().room;
//     console.log("LOOK command:", room);
  
//     // Get the description and visible items in the room and format a message about them.
//     const roomDescription = room.description;
//     const roomItems = room.items.filter((item) => item.visibility);
//     let itemsMessage = "";
//     if (roomItems.length === 0) {
//       itemsMessage = "There is nothing in the room.";
//     } else {
//       // Combine the same items and quantity
//       const roomItemsMap = roomItems.reduce((itemsMap, item) => {
//         const existingItem = itemsMap.get(item.id);
//         if (existingItem) {
//           existingItem.quantity += item.current_quantity;
//         } else {
//           itemsMap.set(item.id, { text: item.appearance, quantity: item.current_quantity });
//         }
//         return itemsMap;
//       }, new Map());
//       // Construct a list of items in the room
//       const itemsList = Array.from(roomItemsMap.values())
//         .map((item) => `${item.text} (${item.quantity})`)
//         .join(", ");
//       itemsMessage = `The room contains ${itemsList}.`;
//     }
  
//     // Get the doors in the room and format a message about them.
//     const doors = room.doors;
//     let exitsMessage = "";
//     if (Object.values(doors).some((hasDoor) => hasDoor)) {
//       const exitDirections = Object.entries(doors)
//         .filter(([direction, hasDoor]) => hasDoor)
//         .map(([direction]) => direction);
//       if (exitDirections.length === 1) {
//         exitsMessage = `This room has an exit to the ${exitDirections[0]}.`;
//       } else {
//         const lastDirection = exitDirections.pop();
//         exitsMessage = `This room has exits to the ${exitDirections.join(", ")} and ${lastDirection}.`;
//       }
//     } else {
//       exitsMessage = "This room has no exits!";
//     }
  
//     // Construct the response message by combining the room description, item message, and exits message.
//     const messageDataToPush = {
//       sender: "LOOK",
//       body: `${roomDescription} ${itemsMessage} ${exitsMessage}`,
//     };
  
//     // Push the message to the chat and broadcast the message to all users except the sender.
//     chat.push(messageDataToPush);
//     io.emit("chat_update", messageDataToPush);
  
//     // Send the message to the sender only.
//     user.socket.emit("chat_update", messageDataToPush);
//     user.socket.emit("user_update", user.emitUser());
//   }
  
//   // Export the 'process' function for use in other modules.
//   module.exports = {
//     process,
//   };
  