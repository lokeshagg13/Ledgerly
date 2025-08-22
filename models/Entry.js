const mongoose = require("mongoose");

const entryItemSchema = new mongoose.Schema({
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

const entrySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    entries: [entryItemSchema]
}, { timestamps: true });

entrySchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Entry", entrySchema);
