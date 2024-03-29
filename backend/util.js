// search through players and find the one with a given socket
function findUserFromSocket(users, socket) {
    
    for (let [_, playerobj] in Object.entries(users)) {
        if (playerobj == null) continue
        if (playerobj.socket.id == socket.id) return playerobj
    }

    console.log("Could not find player with socket: " + socket)
    return null
}

function generateRandomName() {
    var name = '';
    var names = ["Bob", "Joe", "Mary", "Jesse", "Spoon", "Fork", "Spork", "Noodle", "Fred", "Cyrus", "Barb", "Elle", "Justin", "Dustin", "Susie"];
    var namesLength = names.length;
    name = names[Math.floor(Math.random() * namesLength)];
    return name;
}

// Utilities and generators
function makeid(n) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < n; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports = {
    findUserFromSocket,
    generateRandomName,
    makeid,
}