// =============== VARIABLE SETUP =============== //
const socket = io();
var chat_log = []; // local chat lot to browser
var cmd_his = []; // history of all user-entered commands
var his_pos = 0; // the index of the cmd history
var character_creation_mode = false;
var username = "mudjs"; // for chat input


// =============== SOCKET INTERACTIONS =============== //
socket.on("chat_update", function (message) { // Update chat with new message from server
    console.log("CHAT_UPDATE");
    chat_log.push(message);
    chat_update();
});

socket.on("user_update", function (user) {
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

// =============== CHAT FUNCTIONS =============== //
function local_chat(body){ // update chat with new LOCAL message
    let today = new Date();
    let message = {
        color: "red",
        sender: "SERVER",
        body: body,
        timestamp: today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()

    }
    chat_log.push(message);
    chat_update()
}
function chat_update(){
    let chatbox = document.getElementById("chatbox");
    chatbox.innerHTML = "";
    for (x = 0; x < chat_log.length; x++){
        let list_item = "<span style='color: " + chat_log[x].color + "'>[" + chat_log[x].sender + "]</span><span style='color: rgba(255,255,255,0.4)'> (" + chat_log[x].timestamp + ")</span><span> " + chat_log[x].body + "</span><br>";
        chatbox.innerHTML += list_item;
    }
    chatbox.scrollTop = chatbox.scrollHeight;
    chatbox.innerHTML += '<span id="prompt">'+username+':/$ </span><input onblur="this.focus()" autofocus type="text" id="input">';
    document.getElementById("input").focus();
}

function send_message(text){
    let cmd = text.split(" ")[0].toLowerCase();
    let body = text.split(" ").slice(1).join(" ");
    var today = new Date();
    data = {
        color: "#00EE00",
        cmd: cmd,
        body: body,
        sender: null,
        timestamp: today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
    };
    socket.emit("message", data);
}

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
function on_connect(){
    if (localStorage.getItem("MUD_playerid") == null){
        let new_id = makeid(12); // make random 12 char string
        localStorage.setItem("MUD_playerid", new_id)
    }
    socket.emit("on_connect", localStorage.getItem("MUD_playerid"));
}

$( document ).ready(function() { // When document loads, set up events and keys
    
    on_connect();
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
        console.log(his_pos);
        console.log(cmd_his);
    });
});