const move_flavors = ["You run", "You walk", "You stumble", "..."]

function moveNorth(world, message_data, user, users, chat, io) {
    message_data.sender = "MOVE";
    message_data.body = move_flavors[0] + " north."

    // move the user's character
    let moveSuccessful = user.moveNorth(world)
    if (moveSuccessful) {
        message_data.body = move_flavors[0] + " north.";
    } 
    else {
        message_data.body = "You could not move north, sorry!";
    }
    
    chat.push(message_data);
    user.socket.emit("chat_update", message_data);
}

function moveSouth(world, message_data, user, users, chat, io) {
    message_data.sender = "MOVE";

    // move the user's character
    let moveSuccessful = user.moveSouth(world)
    if (moveSuccessful) {
        message_data.body = move_flavors[0] + " south.";
    } 
    else {
        message_data.body = "You could not move south, sorry!";
    }
    
    chat.push(message_data);
    user.socket.emit("chat_update", message_data);
}

function moveEast(world, message_data, user, users, chat, io) {
    message_data.sender = "MOVE";

    // move the user's character
    let moveSuccessful = user.moveEast(world);
    if (moveSuccessful) {
        message_data.body = move_flavors[0] + " east.";
    } 
    else {
        message_data.body = "You could not move east, sorry!";
    }
    
    chat.push(message_data);
    user.socket.emit("chat_update", message_data);
}

function moveWest(world, message_data, user, users, chat, io) {
    message_data.sender = "MOVE";
    
    // move the user's character
    let moveSuccessful = user.moveWest(world);
    if (moveSuccessful) {
        message_data.body = move_flavors[0] + " west.";
    } 
    else {
        message_data.body = "You could not move west, sorry!";
    }
    
    chat.push(message_data);
    user.socket.emit("chat_update", message_data);
}

module.exports = {
    moveNorth,
    moveSouth,
    moveEast,
    moveWest
}