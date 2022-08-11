const express = require("express");
const socket = require("socket.io");
const utils = require("./backend/util.js");
const objects = require("./backend/objects.js");

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
var users = {};
var sessions = {}

// Socket Setup
const io = socket(server);

io.on("connection", function (socket) {
    console.log("--> Creating new Session.");
    let session = new objects.Session(socket)
    sessions[session.socket_id] = session
    let user = null

    socket.on("disconnect", function () {
        var today = new Date();
        if (user == null) return
        var newchat = {
            color: "yellow",
            body: `Player ${user.name} disconnected.`,
            sender: "SERVER",
            timestamp: today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
        };
        chat.push(newchat);
        io.emit("chat_update", newchat);
        console.log("--> Removing Session.")
        let id = session.socket_id
        delete sessions.id
        session = null
    });

    socket.on("connect_player", function(user_id) {
        user = users[user_id];
        if (user == null) {
            console.log("--> Creating new User.");
            users[user_id] = new objects.User(user_id, "user_" + (Object.keys(users).length + 1), session);
            user = users[user_id];
        }
        //socket.emit("player_update", player) // Treat this on the client as READ-ONLY
        // emit that character back to the client
        
        // else, create create a new character, then emit back to client
        var today = new Date();
        var newchat = {
            color: "yellow",
            body: "Player " + user.name + " connected.",
            sender: "SERVER",
            timestamp: today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
        };
        chat.push(newchat)
        io.emit("chat_update", newchat);
    })

    socket.on("message", function(message) {
        message.sender = user.name
        chat.push(message);
        io.emit("chat_update", message);
    });
});