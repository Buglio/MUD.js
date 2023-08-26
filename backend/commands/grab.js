const GRAB_PROBABILITY = 0.5;
const PROBABILITY_DIFFERENCE = 0.15

function process(message_data, user, users, chat, io) {
    console.log("GRAB command");
    let room = user.getCurrentCharacter().room;
    let body = message_data.body;

    message_data.sender = "GRAB";

    let character = user.getCurrentCharacter();

    // no items in the room
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
    // more than one item in the room and arg specified
    // Figures out what to do with item search based on fuzzy search and probabilities
    else { 
        let weights = termProbability(message_data.body, room.items) // get weights from all items in room from fuzzy search
        if (weights[0].prob <= GRAB_PROBABILITY || weights == []){ // best option is not close enough to matching anything
            message_data.body = `Couldn't find item \"${body}\"`;
        }
        else if (weights[0].prob >= weights[1].prob + PROBABILITY_DIFFERENCE){ // if best option is 15% better than second best, just grab best option
            let item = room.removeItemFromRoom(weights[0].item.id);
            character.addItemToInventory(item);
            message_data.body = `You grab the ${item.name}.`;

        }
        else if (weights[0].item.id == weights[1].item.id){ // best items are exactly the same, grab just one of them.
            let item = room.removeItemFromRoom(weights[0].item.id);
            character.addItemToInventory(item);
            message_data.body = `You grab the ${item.name}.`;
        }
        else{
            message_data.body = "Please be more specific. :D";
        }
    }
    
    chat.push(message_data);
    user.socket.emit("chat_update", message_data);
    user.socket.emit("user_update", user.emitUser());
}
const levenshteinDistance = (s, t) => {
    if (!s.length) return t.length;
    if (!t.length) return s.length;
    const arr = [];
    for (let i = 0; i <= t.length; i++) {
        arr[i] = [i];
        for (let j = 1; j <= s.length; j++) {
        arr[i][j] =
            i === 0
            ? j
            : Math.min(
                arr[i - 1][j] + 1,
                arr[i][j - 1] + 1,
                arr[i - 1][j - 1] + (s[j - 1] === t[i - 1] ? 0 : 1)
                );
        }
    }
    return arr[t.length][s.length];
};

function termProbability(term, roomItems){ // iterate over each item and determine probability
    output_weights = []
    for (let item of roomItems){
        let score = levenshteinDistance(term.toLowerCase(), item.name.toLowerCase());
        let prob = 1 - score / item.name.length;
        output_weights.push({prob: prob, item: item});
    }
    return output_weights.sort(function(a, b) { return b.prob - a.prob; }); // sorted list of weights
}

module.exports = {
    process,

}