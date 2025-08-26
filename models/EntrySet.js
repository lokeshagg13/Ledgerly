const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["credit", "debit"],
        required: true
    },
    headId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Head",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    serial: {
        type: Number,   // Serial number within a particular date
        required: true
    }
}, { _id: false });

const entrySetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    entries: [entrySchema]
}, { timestamps: true });

entrySetSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("EntrySet", entrySetSchema);

