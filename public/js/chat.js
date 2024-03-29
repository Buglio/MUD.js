// =============== CHAT FUNCTIONS =============== //
function local_chat(body){ // update chat with new LOCAL message
    let today = new Date();
    let message = {
        color: "red",
        sender: "SERVER",
        body: body,
        timestamp: today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()

    }
    GLOBAL.chat_log.push(message);
    chat_update()
}
function chat_update(){
    let chatbox = document.getElementById("chatbox");
    chatbox.innerHTML = "";
    for (x = 0; x < GLOBAL.chat_log.length; x++){
        let list_item = "<span style='color: " + GLOBAL.chat_log[x].color + "'>[" + GLOBAL.chat_log[x].sender + "]</span><span style='color: rgba(255,255,255,0.4)'> (" + GLOBAL.chat_log[x].timestamp + ")</span><span> " + GLOBAL.chat_log[x].body + "</span><br>";
        chatbox.innerHTML += list_item;
    }
    chatbox.scrollTop = chatbox.scrollHeight;
    // The chat input
    chatbox.innerHTML += '<span id="prompt">' + GLOBAL.displayname + ':/$ </span>';
    const promptWidth = document.getElementById("prompt").offsetWidth + 10;
    chatbox.innerHTML += '<input onblur="this.focus()" autofocus type="text" id="input" style="width: calc(100% - '+promptWidth+'px)">';
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
    GLOBAL.socket.emit("message", data);
}