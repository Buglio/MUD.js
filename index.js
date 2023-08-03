const { app } = require("./depends.js");
const socket = require("socket.io");

require('dotenv').config();

// Objects
const _user_ = require("./backend/classes/user.js");
const _character_ = require("./backend/classes/character.js");
const _chat_message_ = require("./backend/classes/chatMessage.js");
const { World } = require("./backend/classes/world.js");

// Commands
const say = require("./backend/commands/say.js");
const look = require("./backend/commands/look.js");
const move = require("./backend/commands/move.js");
const grab = require("./backend/commands/grab");
const drop = require("./backend/commands/drop.js");

// test world
// const world = require("./backend/testWorld.js").world;
const world = new World("aGrxbWZ_map.json");

// START SERVER
const PORT = process.env.PORT || 8088;
const server = app.listen(PORT, function () {
    console.log("----- MUD -----");
    console.log(`listening at http://localhost:${PORT}`);
});

// Socket Setup
const io = socket(server);

// Server Data
var users = {};
var chat = [];

io.on("connection", function (socket) {
    console.log("--> Creating new Session.");
    let user = null; // Initialize user pointer to null

    // ===== ACCOUNT AND CONNECTION MANAGEMENT ===== //
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
        console.log("--> Removing Session.");
    });

    socket.on("on_check_auth", function(cached_auth, callback) {
        console.log(cached_auth);
        var result = false;
        var err = null;

        for (let [_, value] of Object.entries(users)) {
            if (value.checkAuthToken(cached_auth)) {
                result = true;
            }
        }

        callback(err, result);
    });

    socket.on("on_login", function(user_id) {
        // try to find an existing user with the given id
        user = users[user_id];
        // if no user with the given id was found, create a new one
        if (user == null) {
            console.log("--> Creating new User.")
            user = new _user_.User( // create the user object
                user_id = user_id, 
                username = "user_" + (Object.keys(users).length + 1),  // TODO: replace with user-defined username (with validation)
                socket = socket,
                auth_token = "hello"
            );
            users[user_id] = user;
            /* When Character is created

            // Create a starting character for the new user
            user.addCharacter(new _character_.Character(
                name = "the CHARACTER"
            ));
            user.setRoom(world.getRoom(0,0)); // set the new character's current room to origin
            users[user_id]= user; // add user to users dict
            user = users[user_id]; // update local user pointer to reference the dict entry

            //add the user to their room
            //user.room.addUser(user)
            let today = new Date();
            let newchat = new _chat_message_.ChatMessage( // generate user connected chat msg
                color = "yellow",
                body = "Player " + user.username + " connected.",
                sender = "SERVER",
                timestamp = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
            );
            chat.push(newchat); // push it to server chat history
            io.emit("chat_update", newchat); // send the msg to all users
            */
        }
        else{ // adding this so that a reconnecting player with a new socket is not ignored.
            user.socket = socket;
            users[user_id] = user;
        }
        
        socket.emit("user_update", user.emitUser());
    })
    socket.on("change_username", function(data) {
        username = data.username;
        user_id = data.user_id;
        users[user_id].setUsername(username);
        io.emit("user_update", users[user_id].emitUser());
    });

    // ===== CHARACTER MANAGEMENT ===== //
    socket.on("create_character", function(data){
        let char_name = data[0];
        let user_id = data[1];
        let user = users[user_id];
        // check if player name is valid TBD

        // create character attached to user
        let new_char = new _character_.Character(char_name)
        new_char.room = world.getStartRoom();
        user.characters.push(new_char);
        user.current_character = user.characters.length - 1;
        
        socket.emit("user_update", user.emitUser());
    });
    // ===== COMMANDS ===== //
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
            
            // MOVE SOUTH
            case "s":
            case "south":
                move.moveSouth(world, message_data, user, users, chat, io);
                break;

            // MOVE EAST
            case "e":
            case "east":
                move.moveEast(world, message_data, user, users, chat, io);
                break;

            // MOVE WEST
            case "w":
            case "west":
                move.moveWest(world, message_data, user, users, chat, io);
                break;

            case "grab":
                grab.process(message_data, user, users, chat, io);
                break;

            case "drop":
                drop.process(message_data, user, users, chat, io);
                break;

            // INVALID COMMAND ENTERED
            default:
                let today = new Date();
                let newchat = new _chat_message_.ChatMessage( // generate disconnect chat msg
                    color = "red",
                    body = `Invalid command: ` + message_data,
                    sender = "ERR",
                    timestamp = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
                );
                newchat.body = message_data.cmd + " is not a valid command.";
                newchat.color = "red";
                chat.push(newchat);
                socket.emit("chat_update", newchat);
        }
    });
});
