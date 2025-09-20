const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "chat"
    },
    text: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})


const messageModel = mongoose.model("message", messageSchema);

module.exports = messageModel;