// =============== VARIABLE SETUP =============== //
var GLOBAL = {
    socket: io(),
    chat_log: [], // local chat lot to browser
    cmd_his: [], // history of all user-entered commands
    his_pos: 0, // the index of the cmd history
    character_creation_mode: false,
    user: {},
    displayname: "",
    localmap: {},
    MUDJS_AUTH_TOKEN: "MUDJS_AUTH_TOKEN"
}
// =============== SOCKET INTERACTIONS =============== //
GLOBAL.socket.on("chat_update", function (message) { // Update chat with new message from server
    console.log("CHAT_UPDATE");
    GLOBAL.chat_log.push(message);
    chat_update();
});

GLOBAL.socket.on("user_update", function (user) {
    // update local map
    if (user.characters[user.current_character]){
        let current_room = user.characters[user.current_character].room;
        
        if (!GLOBAL.localmap[current_room.x]){
            GLOBAL.localmap[current_room.x] = {};
            GLOBAL.localmap[current_room.x][current_room.y] = current_room;
        }
        else {
            GLOBAL.localmap[current_room.x][current_room.y] = current_room;
        }
        local_map_update(user);
    }
    
    
    
    if (user.characters.length != 0){ GLOBAL.displayname = user.characters[user.current_character].name; }
    
    //username = user.characters[user.current_character].name;
    if (user.characters.length == 0) { // creating a character if none exist
        create_character();
    }
    else{
        render_interface(user.characters[user.current_character]); // call render in interface.js
        if (GLOBAL.chat_log.length == 0){
            local_chat("Reconnected to server as character " + user.characters[user.current_character].name + ".");
        }
    }
    if (GLOBAL.character_creation_mode == true && user.characters.length != 0){ // none existed, now we have created a character
        // character created! start doing stats stuff
        GLOBAL.character_creation_mode = false;
        document.getElementById("input").placeholder = "";
        GLOBAL.displayname = `${user.characters[user.current_character].name} (${GLOBAL.user.username})`;
        local_chat("Character " + user.characters[user.current_character].name + " was created.");
    }
});

GLOBAL.socket.on('disconnect', function(){
    // when disconnected, logout
    window.location.href = "/auth/logout";
});

// =============== USER/CHARACTER FUNCTIONS =============== //
function create_character(){
    GLOBAL.character_creation_mode = true;
    // character creation logic goes here
    local_chat("You have no characters. Please enter a name to get started...");
    document.getElementById("input").placeholder = "enter a name";
}

function change_username() { // SUS
    let username = prompt("Please enter your new username:", "Trogdor");
    GLOBAL.socket.emit("change_username", { username: username, user_id: GLOBAL.user.userId });
}

// =============== INIT/SETUP FUNCTIONS =============== //

// RUNS WHEN PLAYER LOGS IN
function on_login(){
    $.ajax({ // api request using built in user data
        type: 'GET',
        url: '/auth/user',
        success: function(user) { 
            console.log(user);
            GLOBAL.socket.emit("on_login", user.userId);
            document.getElementById("username").innerHTML = `Account Name: <strong>${user.username}</strong>`;
            GLOBAL.user = user;
            GLOBAL.displayname = user.username
        },
        error: function(xhr, status, err) {
            console.error('DATA: XHR Error.');
        }
    });    
}

$( document ).ready(function() { // When document loads, set up events and keys
    
    on_login();
    let current_input = "";
    $("body").on('keyup', function (e) {
        // if e != ENTER, return null
        var input_val = document.getElementById("input").value;
        if (e.key === 'Enter' || e.keyCode === 13) {
            GLOBAL.his_pos = 0; // reset history position
            if (GLOBAL.character_creation_mode == true){
                GLOBAL.displayname = input_val;
                chat_update();
                GLOBAL.socket.emit("create_character", [input_val,GLOBAL.user.userId]);
            }else{
                send_message(input_val);
                GLOBAL.cmd_his.push(input_val);
            }
            document.getElementById("input").value = "";
        } else if (e.keyCode === 38 && GLOBAL.his_pos > -GLOBAL.cmd_his.length) { // arrow up key
            if (GLOBAL.his_pos === 0) {
                current_input = input_val;
            }
            GLOBAL.his_pos -= 1;
            document.getElementById("input").value = GLOBAL.cmd_his[GLOBAL.cmd_his.length + GLOBAL.his_pos];
            
        } else if (e.keyCode === 40 && GLOBAL.his_pos < 0) { // arrow down key
            GLOBAL.his_pos += 1;
            if (GLOBAL.his_pos == 0) {
                document.getElementById("input").value = current_input
            } else {
                document.getElementById("input").value = GLOBAL.cmd_his[GLOBAL.cmd_his.length + GLOBAL.his_pos];
            }
        }
    });
});