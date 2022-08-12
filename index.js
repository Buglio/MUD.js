const express = require("express");
const socket = require("socket.io");
const utils = require("./backend/util.js");
const objects = require("./backend/objects.js");

// App setup
const PORT = process.env.PORT || 8088;
const app = express();

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render("index");
});
app.use(express.static(__dirname + '/public'));

// START SERVER
const server = app.listen(PORT, function () {
    console.log("----- MUD -----");
    console.log(`listening at http://localhost:${PORT}`);
});

// Server Data
var sessions = {};
var users = {};
var chat = [];

// World Data
var world_map = new objects.World();
var start_room = new objects.Room(
    x = 0,
    y = 0,
    description = "This is the starting room all new adventurers are dropped into."
);
world_map.addRoom(start_room);

// Socket Setup
const io = socket(server);

io.on("connection", function (socket) {
    console.log("--> Creating new Session.");
    let session = new objects.Session(socket);
    sessions[session.socket_id] = session;
    let user = null;

    socket.on("disconnect", function () {
        let today = new Date();
        if (user == null) return
        let newchat = new objects.ChatMessage(
            color = "yellow",
            body = `Player ${user.username} disconnected.`,
            sender = "SERVER",
            timestamp = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
        );
        chat.push(newchat);
        io.emit("chat_update", newchat);

        // remove the user from their room
        user.room.removeUser(user)

        console.log("--> Removing Session.");
        let id = session.socket_id;
        delete sessions.id;
        session = null;
    });

    socket.on("connect_player", function(user_id) {
        // try to find an existing user with the given id
        user = users[user_id];
        // if no user with the given id was found, create a new one
        if (user == null) {
            console.log("--> Creating new User.")
            user = new objects.User(
                user_id = user_id, 
                username = "user_" + (Object.keys(users).length + 1), 
                session = session
                );
                users[user_id]= user;
            
            user.setRoom(start_room)

            // add the user to their room
            user.room.addUser(user)
        }
        //socket.emit("player_update", player) // Treat this on the client as READ-ONLY
        let today = new Date();
        let newchat = new objects.ChatMessage(
            color = "yellow",
            body = "Player " + user.username + " connected.",
            sender = "SERVER",
            timestamp = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
        );
        chat.push(newchat);
        io.emit("chat_update", newchat);
    })

    socket.on("message", function(message_data) {
        let body = message_data.body;
        let command = body.replace(/ .*/,''); // gets the first word

        // TODO: make the command handling an actual thing
        // TODO: only send chat updates to sockets whose characters are in the same room as the sender
        if (command.toLowerCase() == "say") {
            let regex = /(?<=say).+/;
            let msg = body.match(regex);
            
            message_data.body = msg;
            message_data.sender = user.username;
            chat.push(message_data);
            io.emit("chat_update", message_data);
        }

        else if (command.toLowerCase() == "look") {
            message_data.body = user.room.description;
            message_data.sender = "LOOK";
            message_data.color = "grey";
            socket.emit("look_response", message_data);
        }
        
    });
});