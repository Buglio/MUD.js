// search through players and find the one with a given socket
function findPlayerWithSocket(players, socket) {
    //console.log(socket)
    for (const [playerid, playerobj] of Object.entries(players)) {
        if (playerobj.socket == socket) return playerobj
    }

    console.log("Could not find player with socket: " + socket)
    return null
}

module.exports = {
    findPlayerWithSocket
}