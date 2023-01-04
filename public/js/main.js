// =============== VARIABLE SETUP =============== //
const socket = io();
var chat_log = []; // local chat lot to browser
var cmd_his = []; // history of all user-entered commands
var his_pos = 0; // the index of the cmd history
var character_creation_mode = false;
var username = "mudjs"; // for chat input
var localmap = {};
const MUDJS_AUTH_TOKEN = "MUDJS_AUTH_TOKEN";

// =============== SOCKET INTERACTIONS =============== //
socket.on("chat_update", function (message) { // Update chat with new message from server
    console.log("CHAT_UPDATE");
    chat_log.push(message);
    chat_update();
});

socket.on("user_update", function (user) {
    // update local map
    if (user.characters[user.current_character]){
        let current_room = user.characters[user.current_character].room;
        
        if (!localmap[current_room.x]){
            localmap[current_room.x] = {};
            localmap[current_room.x][current_room.y] = current_room;
        }
        else {
            localmap[current_room.x][current_room.y] = current_room;
        }
        local_map_update(user);
    }
    
    
    
    if (user.characters.length != 0){ username = user.characters[user.current_character].name; }
    
    //username = user.characters[user.current_character].name;
    if (user.characters.length == 0) { // creating a character if none exist
        create_character();
    }
    else{
        render_interface(user.characters[user.current_character]); // call render in interface.js
        if (chat_log.length == 0){
            local_chat("Reconnected to server as character " + user.characters[user.current_character].name + ".");
        }
    }
    if (character_creation_mode == true && user.characters.length != 0){ // none existed, now we have created a character
        // character created! start doing stats stuff
        character_creation_mode = false;
        document.getElementById("input").placeholder = "";
        local_chat("Character " + user.characters[user.current_character].name + " was created.");
    }
});

socket.on('disconnect', function(){
    location.reload();
});

// =============== USER/CHARACTER FUNCTIONS =============== //
function create_character(){
    character_creation_mode = true;
    // character creation logic goes here
    local_chat("You have no characters. Please enter a name to get started...");
    document.getElementById("input").placeholder = "enter a name";
}

function change_username() {
    let username = prompt("Please enter your new username:", "Trogdor");
    socket.emit("change_username", { username: username, user_id: localStorage.getItem("MUD_playerid") });
}

// =============== INIT/SETUP FUNCTIONS =============== //
// RUN WHEN BROWSER STARTS
function on_connect() {
    var cached_auth = localStorage.getItem(MUDJS_AUTH_TOKEN);
    var cached_auth = "hello!";
    if (cached_auth != null) {
        socket.emit("on_check_auth", cached_auth, function (err, result) {
            console.log("success? "+result);

            if (result === false) {
                window.location = location.href+"auth";
            }
        });
    }
    // let new_token = makeid(12); // make random 12 char string
    // localStorage.setItem(MUDJS_AUTH_TOKEN, new_token)
}

// RUNS WHEN PLAYER LOGS IN
function on_login(){
    if (localStorage.getItem("MUD_playerid") == null){
        let new_id = makeid(12); // make random 12 char string
        localStorage.setItem("MUD_playerid", new_id)
    }
    socket.emit("on_login", localStorage.getItem("MUD_playerid"));
}

$( document ).ready(function() { // When document loads, set up events and keys
    
    on_login();
    let current_input = "";
    $("body").on('keyup', function (e) {
        var input_val = document.getElementById("input").value;
        if (e.key === 'Enter' || e.keyCode === 13) {
            his_pos = 0; // reset history position
            if (character_creation_mode == true){
                username = input_val;
                chat_update();
                socket.emit("create_character", [input_val,localStorage.getItem("MUD_playerid")]);
            }else{
                send_message(input_val);
                cmd_his.push(input_val);
            }
            document.getElementById("input").value = "";
        } else if (e.keyCode === 38 && his_pos > -cmd_his.length) { // arrow up key
            if (his_pos === 0) {
                current_input = input_val;
            }
            his_pos -= 1;
            document.getElementById("input").value = cmd_his[cmd_his.length+his_pos];
            
        } else if (e.keyCode === 40 && his_pos < 0) { // arrow down key
            his_pos += 1;
            if (his_pos == 0) {
                document.getElementById("input").value = current_input
            } else {
                document.getElementById("input").value = cmd_his[cmd_his.length+his_pos];
            }
        }
    });
});