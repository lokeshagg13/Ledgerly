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
    openingBalance: {
        amount: {
            type: Number,
            default: 0
        },
        lastUpdated: {
            type: Date,
            default: Date.now
        }
    }
});

const userModel = mongoose.model("userModel", userSchema, "users");

module.exports = userModel;
