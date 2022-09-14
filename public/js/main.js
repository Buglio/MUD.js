const socket = io();

// local chat to browser
var chat = [];

socket.on("chat_update", function (message) {
    chat.push(message);
    let chatbox = document.getElementById("chatbox");
    chatbox.innerHTML = "";
    for (x = 0; x < chat.length; x++){
        let message = chat[x];
        let list_item = "<span style='color: " + chat[x].color + "'>[" + chat[x].sender + "]</span><span> (" + chat[x].timestamp + ") " + chat[x].body + "</span><br>";
        chatbox.innerHTML += list_item;
    }
    chatbox.scrollTop = chatbox.scrollHeight;
});

// detect if server goes down
socket.on('disconnect', function(){
    location.reload();
});

socket.on("user_update", function (user) {
    if (user.characters.length == 0) {

    }
    let current_char = user.characters[user.current_character];
    document.getElementById('character_name').innerText = current_char.name;
    document.getElementById('character_hp').innerText = "HP: " + current_char.hp.current + "/" + current_char.hp.max;
    document.getElementById('character_dex').innerText = "DEX: " + current_char.stats.dex;
    document.getElementById('character_str').innerText = "STR: " + current_char.stats.str;
    document.getElementById('character_int').innerText = "INT: " + current_char.stats.int;
    document.getElementById('character_wis').innerText = "WIS: " + current_char.stats.wis;
    document.getElementById('character_con').innerText = "CON: " + current_char.stats.con;
    document.getElementById('character_cha').innerText = "CHA: " + current_char.stats.cha;
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
            send_message(document.getElementById("input").value)
            document.getElementById("input").value = "";
        }
    });
});