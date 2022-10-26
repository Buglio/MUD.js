const socket = io();


// local chat to browser
var chat = [];
var character_creation_mode = false;

// Update chat with new message from server
socket.on("chat_update", function (message) {
    console.log("CHAT_UPDATE");
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
// detect if server goes down
socket.on('disconnect', function(){
    location.reload();
    // we could use the modal here
    //document.getElementById("modal").style.display = "block";
});

socket.on("user_update", function (user) {
    console.log(user);
    if (user.characters.length == 0) { // creating a character if none exist
        create_character();
    }
    else{
        if (!character_creation_mode) {}
        console.log('render stats')
        let current_char = user.characters[user.current_character];
        document.getElementById('character_name').innerText = "CHARACTER: " + current_char.name;

        document.getElementById('character_hp').innerText = "HP: " + current_char.hp.current + "/" + current_char.hp.max;
        document.getElementById('character_hp').style.width = (current_char.hp.current / current_char.hp.max * 100) + "%";

        document.getElementById('character_dex').innerText = "DEX: " + current_char.stats.dex;
        document.getElementById('character_dex').style.width = (current_char.stats.dex / 18 * 100) + "%";

        document.getElementById('character_str').innerText = "STR: " + current_char.stats.str;
        document.getElementById('character_str').style.width = (current_char.stats.str / 18 * 100) + "%";

        document.getElementById('character_int').innerText = "INT: " + current_char.stats.int;
        document.getElementById('character_int').style.width = (current_char.stats.int / 18 * 100) + "%";

        document.getElementById('character_wis').innerText = "WIS: " + current_char.stats.wis;
        document.getElementById('character_wis').style.width = (current_char.stats.wis / 18 * 100) + "%";

        document.getElementById('character_con').innerText = "CON: " + current_char.stats.con;
        document.getElementById('character_con').style.width = (current_char.stats.con / 18 * 100) + "%";

        document.getElementById('character_cha').innerText = "CHA: " + current_char.stats.cha;
        document.getElementById('character_cha').style.width = (current_char.stats.cha / 18 * 100) + "%";

        // ######  INVENTORY STUFF #####
        let items_container = document.getElementById('items_container');
        for (let x = 0; x < 24; x++)
        {
            
            let inv_slot = document.createElement("div");
            inv_slot.className = "inv_slot"

            // const item of user.characters[user.current_character].inventory
            if (user.characters[user.current_character].inventory[x]){
                let image = document.createElement("img");
                image.className = "inv_item"
                image.src = "/sprites/"+ user.characters[user.current_character].inventory[x].sprite;
                inv_slot.appendChild(image);            
            }
            items_container.appendChild(inv_slot);
        }
    }
    if (character_creation_mode == true && user.characters.length != 0){ // none existed, now we have created a character
        // character created! start doing stats stuff
        character_creation_mode = false;
        document.getElementById("input").placeholder = "";
        local_chat("Character " + user.characters[user.current_character].name + " was created.");
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
                socket.emit("create_character", [name,localStorage.getItem("MUD_playerid")]);

                document.getElementById("input").value = "";
            }else{
                console.log("send message");
                console.log(document.getElementById("input").value)
                send_message(document.getElementById("input").value)
                document.getElementById("input").value = "";
            }
            
        }
    });
});