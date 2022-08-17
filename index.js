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
app.get('/man', function(req, res) {
    res.render("man.ejs");
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
var second_room = new objects.Room(
    x = 0,
    y = 1,
    description = "This is the second room, south of the starting room"
);

world_map.addRoom(start_room);
world_map.addRoom(second_room);

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
        //user.room.removeUser(user)

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
            user.addCharacter(new objects.Character(
                name = "the CHARACTER"
            ));
            user.setRoom(world_map.getRoom(0,0));
            users[user_id]= user;
            user = users[user_id];
            //add the user to their room
            //user.room.addUser(user)
        }
        let today = new Date();
        let newchat = new objects.ChatMessage(
            color = "yellow",
            body = "Player " + user.username + " connected.",
            sender = "SERVER",
            timestamp = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
        );
        chat.push(newchat);
        io.emit("chat_update", newchat);
        socket.emit("user_update", users[user_id].emitUser());
    })

    socket.on("message", function(message_data) {
        let today = new Date();
        let newchat = new objects.ChatMessage(
            color = "darkgray",
            body = "",
            sender = "SERVER",
            timestamp = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
        );

        switch (message_data.cmd){
            // SAY COMMAND
            case "say": 
                message_data.sender = user.username;
                chat.push(message_data);
                io.emit("chat_update", message_data);
                break;

            // LOOK COMMAND
            case "l":
            case "look":
                newchat.body = user.getCurrentCharacter().room.description;
                newchat.sender = null;
                io.emit("chat_update", newchat);
                break;
            
            // MOVE SOUTH
            /*
            case "s":
            case "south":
                let souths = ["You run south", "You walk south"]
                newchat.body = "You go south";
                newchat.sender = null;
                io.emit("chat_update", newchat);

                character = user.getCurrentCharacter(); //SUS
                character.moveSouth(world_map);
                user.setCurrentCharacter(character);
                socket.emit("user_update", user.emitUser());
                break;
            */
            // INVALID COMMAND ENTERED
            default:
                newchat.body = message_data.cmd + " is not a valid command.";
                newchat.color = "red";
                chat.push(newchat);
                io.emit("chat_update", newchat);
        }
    });
    socket.on("change_username", function(data) {
        username = data[0];
        user_id = data[1];
        users[user_id].setUsername(username);
        io.emit("user_update", users[user_id].emitUser());
    });
});