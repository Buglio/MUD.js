const socket = io();


// local chat to browser
var chat = [];
var character_creation_mode = false;

// Update chat with new message from server
socket.on("chat_update", function (message) {
    chat.push(message);
    let chatbox = document.getElementById("chatbox");
    chatbox.innerHTML = "";
    for (x = 0; x < chat.length; x++){
        let list_item = "<span style='color: " + chat[x].color + "'>[" + chat[x].sender + "]</span><span> (" + chat[x].timestamp + ") " + chat[x].body + "</span><br>";
        chatbox.innerHTML += list_item;
    }
    chatbox.scrollTop = chatbox.scrollHeight;
});

// update chat with new LOCAL message
function local_chat(body){
    let today = new Date();
    let message = {
        color: "red",
        sender: "SERVER",
        body: body,
        timestamp: today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()

    }
    chat.push(message);
    let chatbox = document.getElementById("chatbox");
    chatbox.innerHTML = "";
    for (x = 0; x < chat.length; x++){
        let list_item = "<span style='color: " + chat[x].color + "'>[" + chat[x].sender + "]</span><span> (" + chat[x].timestamp + ") " + chat[x].body + "</span><br>";
        chatbox.innerHTML += list_item;
    }
    chatbox.scrollTop = chatbox.scrollHeight;
}
function create_character(){
    character_creation_mode = true;
    // character creation logic goes here
    local_chat("You have no characters. Please enter a name to get started...");
    document.getElementById("input").placeholder = "enter a name";
}
// if account has no characters stored on the server side
socket.on('no_characters', function(){
    create_character();
});

socket.on("playername_validity", function(data){
    let isValid = data[0];
    let charName = data[1];
    if (isValid){
        // character created! start doing stats stuff
        character_creation_mode = false;
        document.getElementById("input").placeholder = "";
        //socket.emit("create_character", charName);
        local_chat("Character " + charName + " was created.");
    }
    else{
        create_character()
    }
});

// detect if server goes down
socket.on('disconnect', function(){
    //location.reload();
    // we could use the modal here
    document.getElementById("modal").style.display = "block";
});

socket.on("user_update", function (user) {
    if (user.characters.length == 0) {

    }
    else{
        let current_char = user.characters[user.current_character];
        document.getElementById('character_name').innerText = current_char.name;
        document.getElementById('character_hp').innerText = "HP: " + current_char.hp.current + "/" + current_char.hp.max;
        document.getElementById('character_dex').innerText = "DEX: " + current_char.stats.dex;
        document.getElementById('character_str').innerText = "STR: " + current_char.stats.str;
        document.getElementById('character_int').innerText = "INT: " + current_char.stats.int;
        document.getElementById('character_wis').innerText = "WIS: " + current_char.stats.wis;
        document.getElementById('character_con').innerText = "CON: " + current_char.stats.con;
        document.getElementById('character_cha').innerText = "CHA: " + current_char.stats.cha;
    }
    
});

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

function on_connect(){
    if (localStorage.getItem("MUD_playerid") == null){
        let new_id = makeid(12); // make random 12 char string
        localStorage.setItem("MUD_playerid", new_id)
    }
    socket.emit("on_connect", localStorage.getItem("MUD_playerid"));
}

function change_username() {
    let username = prompt("Please enter your new username:", "Trogdor");
    socket.emit("change_username", { username: username, user_id: localStorage.getItem("MUD_playerid") });
  }

// When document loads, 
$( document ).ready(function() {
    on_connect();
    $("#input").on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            if (character_creation_mode == true){
                let name = document.getElementById("input").value;
                socket.emit("check_playername", name);
                document.getElementById("input").value = "";
            }else{
                send_message(document.getElementById("input").value)
                document.getElementById("input").value = "";
            }
            
        }
    });
});