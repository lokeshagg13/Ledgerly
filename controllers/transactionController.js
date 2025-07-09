const TransactionModel = require("../models/Transaction");
const {
    normalizeDate,
    validateRequiredTransactionFields,
    validateTransactionAmount,
    validateTransactionType,
    validateTransactionDate,
    validateTransactionRemarks,
    validateTransactionCategoryId,
    validateTransactionSubcategoryId,
} = require("./utils/validators");

// Get all transactions for the logged-in user
exports.getTransactions = async (req, res) => {
    try {
        const transactions = await TransactionModel
            .find({ userId: req.userId })
            .sort({ date: -1 })
            .populate("categoryId", "name")
            .populate("subcategoryId", "name");

        const formattedTransactions = transactions.map((txn) => ({
            _id: txn._id,
            amount: txn.amount,
            type: txn.type,
            date: txn.date,
            remarks: txn.remarks,
            category: txn.categoryId?.name || null,
            subcategory: txn.subcategoryId?.name || null,
        }));
        return res.status(200).json({ transactions: formattedTransactions });
    } catch (error) {
        return res.status(500).json({ error: "Error fetching transactions: " + error.message });
    }
};

// Add a new transaction for the logged-in user
exports.addTransaction = async (req, res) => {
    // logic to check for edge cases for req body inputs.
    const userId = req.userId;
    const { amount, type, date, remarks, categoryId, subcategoryId } = req.body;
    const remarksTrimmed = remarks?.trim();
    let txnDate;

    try {
        // ✅ Check all required fields
        validateRequiredTransactionFields(req.body, ["amount", "type", "date", "remarks", "categoryId"]);

        // ✅ Field validations
        validateTransactionType(type);
        validateTransactionAmount(amount);
        txnDate = normalizeDate(validateTransactionDate(date));
        validateTransactionRemarks(remarksTrimmed);
        await validateTransactionCategoryId(categoryId, userId);

        if (subcategoryId) {
            await validateTransactionSubcategoryId(subcategoryId, categoryId, userId);
        }
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }

    try {
        // ✅ Prevent duplicates
        const existing = await TransactionModel.findOne({
            userId,
            type,
            amount,
            date: txnDate,
            remarks: { $regex: new RegExp(`^${remarksTrimmed}$`, "i") },
        });
        if (existing) {
            return res.status(409).json({ error: "Duplicate transaction detected." });
        }

        // ✅ Create new transaction
        const newTransaction = await TransactionModel.create({
            userId,
            amount,
            type,
            date: txnDate,
            remarks: remarksTrimmed,
            categoryId,
            subcategoryId: subcategoryId || null
        });
        return res.status(201).json({ transaction: newTransaction });
    } catch (error) {
        return res.status(500).json({ error: "Error adding transaction: " + error.message });
    }
};

// Update a transaction
exports.updateTransaction = async (req, res) => {
    const { transactionId } = req.params;
    const userId = req.userId;
    const { amount, type, date, remarks, categoryId, subcategoryId } = req.body;
    const remarksTrimmed = remarks?.trim();

    const updateFields = {};
    try {
        // Check and validate the fields to be updated
        if (amount) {
            validateTransactionAmount(amount);
            updateFields.amount = amount;
        }
        if (type) {
            validateTransactionType(type);
            updateFields.type = type;
        }
        if (date) {
            updateFields.date = normalizeDate(validateTransactionDate(date));
        }
        if (remarksTrimmed) {
            validateTransactionRemarks(remarksTrimmed);
            updateFields.remarks = remarksTrimmed;
        }
        if (categoryId) {
            await validateTransactionCategoryId(categoryId, userId);
            updateFields.categoryId = categoryId;
        }
        if (subcategoryId) {
            if (!categoryId) {
                const txn = await TransactionModel.findById(transactionId);
                if (!txn) return res.status(404).json({ error: "Transaction not found." });
                updateFields.categoryId = txn.categoryId;
            }
            await validateTransactionSubcategoryId(subcategoryId, updateFields.categoryId, userId);
            updateFields.subcategoryId = subcategoryId;
        }

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ error: "No valid fields provided to update." });
        }
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }

    try {
        // Check if updating the transaction will lead to any duplicate transactions
        const existingTxn = await TransactionModel.findOne({ _id: transactionId, userId });
        if (!existingTxn) return res.status(404).json({ error: "Transaction not found." });
        const duplicateCheck = {
            userId,
            _id: { $ne: transactionId }, // exclude the one being updated
        };
        const finalAmount = amount ?? existingTxn.amount;
        const finalType = type ?? existingTxn.type;
        const finalDate = date ? normalizeDate(validateTransactionDate(date)) : existingTxn.date;
        const finalRemarks = remarksTrimmed ?? existingTxn.remarks?.trim();
        duplicateCheck.amount = finalAmount;
        duplicateCheck.type = finalType;
        duplicateCheck.date = finalDate;
        duplicateCheck.remarks = { $regex: new RegExp(`^${finalRemarks}$`, "i") };
        const duplicate = await TransactionModel.findOne(duplicateCheck);
        if (duplicate) {
            return res.status(409).json({ error: "Duplicate transaction detected." });
        }

        // Update transaction
        const updatedTxn = await TransactionModel.findOneAndUpdate(
            { _id: transactionId, userId },
            { $set: updateFields },
            { new: true }
        );
        if (!updatedTxn) return res.status(404).json({ error: "Transaction not found." });
        return res.status(200).json({ transaction: updatedTxn });
    } catch (error) {
        return res.status(500).json({ error: "Error updating transaction: " + error.message });
    }
};

// Delete a single transaction
exports.deleteSingleTransaction = async (req, res) => {
    try {
        const { transactionId } = req.params;

        const deleted = await TransactionModel.findOneAndDelete({
            _id: transactionId,
            userId: req.userId,
        });

        if (!deleted) {
            return res.status(404).json({ error: "Transaction not found." });
        }

        return res.status(200).json({ message: "Transaction deleted." });
    } catch (error) {
        return res.status(500).json({ error: "Error deleting transaction: " + error.message });
    }
};

// Delete multiple transactions
exports.deleteMultipleTransactions = async (req, res) => {
    try {
        let { transactionIds } = req.body;
        if (!transactionIds) {
            return res.status(400).json({ error: "transactionIds is required." });
        }

        if (!Array.isArray(transactionIds)) {
            transactionIds = [transactionIds];
        }

        const deletedResult = await TransactionModel.deleteMany({
            _id: { $in: transactionIds },
            userId: req.userId,
        });

        if (deletedResult.deletedCount === 0) {
            return res.status(404).json({ error: "No matching transactions found to delete." });
        }

        return res.status(200).json({
            message: `${deletedResult.deletedCount} transaction(s) deleted.`
        });
    } catch (error) {
        return res.status(500).json({ error: "Error deleting transaction(s): " + error.message });
    }
};
