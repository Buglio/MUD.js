const socket = io();

socket.on("chat_update", function (chat) {
    let chatbox = document.getElementById("chatbox");
    chatbox.innerHTML = "";

    console.log("Chat update!");
    for (x = 0; x < chat.length; x++){
        let message = chat[x];
        console.log(message);
        let list_item = "<span style='color: " + chat[x].color + "'>[" + chat[x].sender + "] (" + chat[x].timestamp + ") " + chat[x].body + "</span><br>";
        chatbox.innerHTML += list_item;
    }
});


function send_message(body){
    var today = new Date();
    data = {
        color: "#00EE00",
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
    socket.emit("connect_player", localStorage.getItem("MUD_playerid"));
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