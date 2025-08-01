const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    amount: {
        type: Number,
        required: true,
        min: [0, "Amount must be positive"]
    },
    type: {
        type: String,
        enum: ["credit", "debit"],
        required: true,
        index: true
    },
    date: {
        type: Date,
        default: Date.now,
        index: true
    },
    remarks: {
        type: String,
        trim: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        default: null,
        index: true
    },
    subcategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subcategory",
        default: null,
        index: true
    }
});

transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, type: 1, amount: 1, date: 1, remarks: 1 });
transactionSchema.index({ userId: 1, categoryId: 1, date: 1 });
transactionSchema.index({ remarks: "text" });

module.exports = mongoose.model("Transaction", transactionSchema);
