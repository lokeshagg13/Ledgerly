const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    refreshToken: {
        type: String,
        default: "",
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    accountBalance: {
        type: Number,
        default: 0
    },
    lastUpdatedOn: {
        type: Date,
        default: null
    }
});

const userModel = mongoose.model("userModel", userSchema, "users");

module.exports = userModel;
