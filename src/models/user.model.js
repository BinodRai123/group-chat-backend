const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    profileImage: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
})

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;