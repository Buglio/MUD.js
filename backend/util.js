// search through players and find the one with a given socket
function findUserFromSocket(users, socket) {
    
    for (let [_, playerobj] in Object.entries(users)) {
        if (playerobj == null) continue
        if (playerobj.socket.id == socket.id) return playerobj
    }

    console.log("Could not find player with socket: " + socket)
    return null
}

module.exports = {
    findUserFromSocket
}