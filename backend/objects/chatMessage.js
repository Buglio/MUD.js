class ChatMessage {
    constructor(color, body, sender, timestamp) {
        this.color = color;
        this.body = body;
        this.sender = sender;
        this.timestamp = timestamp;
    }
}

module.exports = {
    ChatMessage,
    
}