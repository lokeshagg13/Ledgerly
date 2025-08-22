const mongoose = require("mongoose");

const headsSchema = new mongoose.Schema({
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

headsSchema.index({ userId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Heads", headsSchema);