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
var users = {};
var sessions = {}

class Session {
    constructor(socket) {
        this.socket = socket
        this.socket_id = socket.id
    }
}

class User {
    constructor(user_id, session, character) {
        this.user_id = user_id
        this.session = session
        this.character = character
    }
}

class Character {
    constructor(name) {
        this.name = name
        this.user = null
    }

    setUser(user) {
        this.user = user
    }
    
}

// Socket Setup
const io = socket(server);

io.on("connection", function (socket) {
    console.log("--> Made socket connection");
    let session = new Session(socket)
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
        let id = session.socket_id
        delete sessions.id
        session = null
    });

    socket.on("connect_player", function(user_id) {
        user = users[user_id]
        if (user == null) {
            user = {
                id: user_id,
                name: generateRandomName(),
                stats: {
                    health: 10,
                    strength: 3,
                    intelligence: 7,
                }
            }
            users[user_id] = user
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

function generateRandomName() {
    var name = '';
    var names = ["Bob", "Joe", "Mary", "Jesse", "Spoon", "Fork", "Spork", "Noodle", "Fred", "Cyrus", "Barb", "Elle", "Justin", "Dustin", "Susie"];
    var namesLength = names.length;
    name = names[Math.floor(Math.random() * namesLength)];
    return name;
}