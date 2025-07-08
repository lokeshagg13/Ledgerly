const mongoose = require("mongoose");
const CategoryModel = require("../models/Category");
const SubcategoryModel = require("../models/Subcategory");

exports.validateRequiredTransactionFields = (body, fields = []) => {
    const missing = fields.filter((field) => !body[field]);
    if (missing.length > 0) {
        throw new Error(`Missing required field(s): ${missing.join(", ")}`);
    }
};

exports.normalizeDate = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

exports.validateTransactionType = (type) => {
    if (!["credit", "debit"].includes(type)) {
        throw new Error("Transaction type is invalid.");
    }
};

exports.validateTransactionAmount = (amount) => {
    if (typeof amount !== "number" || amount <= 0) {
        throw new Error("Amount must be a positive number.");
    }
};

exports.validateTransactionDate = (date) => {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
        throw new Error("Transaction date format is invalid.");
    }
    return parsedDate;
};

exports.validateTransactionRemarks = (remarks) => {
    if (!remarks || typeof remarks !== "string" || !remarks.trim()) {
        throw new Error("Transaction remarks is required.");
    }
};

exports.validateTransactionCategoryId = async (categoryId, userId) => {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        throw new Error("Category ID is invalid.");
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("User ID is invalid.");
    }
    const exists = await CategoryModel.exists({ _id: categoryId, userId });
    if (!exists) {
        throw new Error("Category ID is invalid.");
    }
};

exports.validateTransactionSubcategoryId = async (subcategoryId, categoryId, userId) => {
    if (!mongoose.Types.ObjectId.isValid(subcategoryId)) {
        throw new Error("Subcategory ID is invalid.");
    }
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        throw new Error("Category ID is invalid.");
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("User ID is invalid.");
    }
    const exists = await SubcategoryModel.exists({
        _id: subcategoryId,
        categoryId,
        userId,
    });
    if (!exists) {
        throw new Error("Subcategory ID is invalid.");
    }
};
