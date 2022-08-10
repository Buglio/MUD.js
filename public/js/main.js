const socket = io();

socket.on("chat_update", function (data) {
    let chatbox = document.getElementById("chatbox");
    chatbox.innerHTML = "";

    console.log("Chat update!");
    for (x = 0; x < data.length; x++){
        let list_item = "<li>" + data[x] + "</li>";
        chatbox.innerHTML += list_item;
    }
});


function send_message(data){
    socket.emit("message", data);
}

function on_connect(){
    if (localStorage.getItem("MUD_playerid") == null){
        let new_id = makeid(12); // make random 12 char string
        localStorage.setItem("MUD_playerid", new_id)
    }
    socket.emit("connect_player", localStorage.getItem("MUD_playerid"));
}

// When document loads, 
$( document ).ready(function() {
    on_connect();
});