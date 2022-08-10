const express = require("express");
const socket = require("socket.io");
const utils = require("./backend/util.js")

// App setup
const PORT = process.env.PORT || 8088;
const app = express();

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render("index")
});
app.use(express.static(__dirname + '/public'));

// START SERVER
const server = app.listen(PORT, function () {
    console.log("----- MUD -----");
    console.log(`listening at http://localhost:${PORT}`);
});

// Server Data
var chat = [];
var players = {};

/*
{
    "as7d8a97sd" : {
        character_name: "Asdasd",
        character_stats: {
            hp: 10,
            socket: sdfdsafasdfasdf
        }
    }
}
*/

// Socket Setup
const io = socket(server);

io.on("connection", function (socket) {
    console.log("--> Made socket connection");
    let player_identifier = null

    socket.on("disconnect", function () {
        if (players[player_identifier] == null) return
        chat.push(`Player ${players[player_identifier].name} disconnected.`);
        io.emit("chat_update", chat);
    });

    socket.on("connect_player", function(playerid) {
        player_identifier = playerid
        if (players[playerid] == null) {
            players[playerid] = {
                name: "Bob",
                stats: {
                    health: 10,
                    strength: 3,
                    intelligence: 7,
                },
                socket: socket
            }
        }
        socket.emit("player_update", players[player_identifier]) // Treat this on the client as READ-ONLY
        // emit that character back to the client
        
        // else, create create a new character, then emit back to client
        chat.push("Player " + players[player_identifier].name + " connected.");
        io.emit("chat_update", chat);
    })

    socket.on("message", function(data) {
        console.log("--> Got message from socket: " + data);
        chat.push(data);
        io.emit("chat_update", chat);
    });
});



