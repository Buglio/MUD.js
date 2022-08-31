const express = require("express");
const socket = require("socket.io");
const utils = require("./backend/util.js");

// Objects
const _user_ = require("./backend/objects/user.js");
const _character_ = require("./backend/objects/character.js");
const _chat_message_ = require("./backend/objects/chatMessage.js");

// Commands
const say = require("./backend/commands/say.js");
const look = require("./backend/commands/look.js");
const move = require("./backend/commands/move.js");

// test world
const world = require("./backend/testWorld.js").world;

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
var users = {};
var chat = [];




// Socket Setup
const io = socket(server);

io.on("connection", function (socket) {
    console.log("--> Creating new Session.");
    let user = null; // Initialize user pointer to null

    socket.on("disconnect", function () {
        let today = new Date();
        if (user == null) return
        let newchat = new _chat_message_.ChatMessage( // generate disconnect chat msg
            color = "yellow",
            body = `Player ${user.username} disconnected.`,
            sender = "SERVER",
            timestamp = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
        );
        chat.push(newchat); // push it to server chat history
        io.emit("chat_update", newchat); // send the msg to all users

        // remove the user from their room
        //user.room.removeUser(user)

        console.log("--> Removing Session.");
    });

    socket.on("connect_player", function(user_id) {
        // try to find an existing user with the given id
        user = users[user_id];
        // if no user with the given id was found, create a new one
        if (user == null) {
            console.log("--> Creating new User.")
            user = new _user_.User( // create the user object
                user_id = user_id, 
                username = "user_" + (Object.keys(users).length + 1),  // TODO: replace with user-defined username (with validation)
                socket = socket
            );

            // Create a starting character for the new user
            user.addCharacter(new _character_.Character(
                name = "the CHARACTER"
            ));
            user.setRoom(world.getRoom(0,0)); // set the new character's current room to origin
            users[user_id]= user; // add user to users dict
            user = users[user_id]; // update local user pointer to reference the dict entry

            //add the user to their room
            //user.room.addUser(user)
        }

        let today = new Date();
        let newchat = new _chat_message_.ChatMessage( // generate user connected chat msg
            color = "yellow",
            body = "Player " + user.username + " connected.",
            sender = "SERVER",
            timestamp = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
        );

        chat.push(newchat); // push it to server chat history
        io.emit("chat_update", newchat); // send the msg to all users
        socket.emit("user_update", user.emitUser());
    })

    socket.on("message", function(message_data) {
        switch (message_data.cmd){
            // SAY COMMAND
            case "say": 
                say.process(message_data, user, users, chat, io)
                break;

            // LOOK COMMAND
            case "l":
            case "look":
                look.process(message_data, user, users, chat, io)
                break;
            
            // MOVE NORTH
            case "n":
            case "north":
                move.moveNorth(world, message_data, user, users, chat, io);
                break;

            // INVALID COMMAND ENTERED
            default:
                newchat.body = message_data.cmd + " is not a valid command.";
                newchat.color = "red";
                chat.push(newchat);
                io.emit("chat_update", newchat);
        }
    });
    socket.on("change_username", function(data) {
        username = data.username;
        user_id = data.uid;
        users[user_id].setUsername(username);
        io.emit("user_update", users[user_id].emitUser());
    });
});