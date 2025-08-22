const mongoose = require("mongoose");

const headSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

headSchema.index({ userId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Head", headSchema);