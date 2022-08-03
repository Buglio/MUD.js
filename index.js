const express = require("express");
const socket = require("socket.io");

// App setup
const PORT = process.env.PORT || 8088;
const app = express();

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render("index",{
    })
});
app.use(express.static(__dirname + '/public'));

// START SERVER
const server = app.listen(PORT, function () {
    console.log("----- MUD -----");
    console.log(`listening at http://localhost:${PORT}`);
});

// Server Data
var chat = [];
var players = [];

/*
{
    "as7d8a97sd" : {
        character_name: "Asdasd",
        character_stats: {
            hp: 10,
            etc
        }
    }
}
*/

// Socket Setup
const io = socket(server);

io.on("connection", function (socket) {
    console.log("--> Made socket connection");

    socket.on("connect_player", function(playerid) {
        console.log("--> Player " + playerid + " connected.");
        // check if playerid exists in data
        // emit that character back to the client

        // else, create create a new character, then emit back to client
    })

    socket.on("message", function(data) {
        console.log("--> Got message from socket: " + data);
        chat.push(data);
        io.emit("chat_update", chat);
    });
});



