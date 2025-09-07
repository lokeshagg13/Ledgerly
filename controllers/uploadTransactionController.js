const fs = require('fs');
const { PdfReader } = require('pdfreader');
const mongoose = require('mongoose');

const TransactionModel = require('../models/Transaction');
const {
    validateRequiredTransactionFields,
    validateTransactionType,
    validateTransactionAmount,
    validateTransactionDate,
    validateTransactionRemarks,
    validateTransactionCategoryId,
    validateTransactionSubcategoryId
} = require('./utils/validators');
const { normalizeDate } = require('./utils/formatters');

function fetchTransactionData(data) {
    const dataStr = data.join(' ');
    let counter = 1;
    const transactions = [];
    while (true) {
        const regex = new RegExp(`\\s+${counter}\\s+(\\d{2}/\\d{2}/\\d{4})\\s+(\\d{2}/\\d{2}/\\d{4})\\s+((?:.|\\s)*?)\\s+(\\d+[.]\\d{1,2})\\s+(\\d+[.]\\d{1,2})\\s+([-]?\\d+[.]\\d{1,2})`, 'gm');
        const match = regex.exec(dataStr);
        if (!match) break;

        const date = match[2];
        const remarks = match[3].trim().replace(/\n+/g, ' ');
        const type = parseFloat(match[4]) === 0 ? "credit" : "debit";
        const amount = type === "debit" ? parseFloat(match[4]) : parseFloat(match[5]);
        const balance = parseFloat(match[6]);
        if (transactions.length > 0) {
            const prevBalance = transactions[transactions.length - 1].balance;
            const expectedBalance = parseFloat((prevBalance + (type === "debit" ? -1 : 1) * amount).toFixed(2));
            if (expectedBalance !== balance) {
                throw new Error(`Balance mismatch in transaction ${counter}. Expected: ${expectedBalance}, Found: ${balance}`);
            }
        }

        transactions.push({ _id: counter, date, type, amount, remarks, balance });
        counter += 1;
    }
    return transactions;
}

exports.extractTransactionsFromPDF = async (req, res) => {
    const pdfPath = req.file.path;
    const data = [];

    try {
        await new Promise((resolve, reject) => {
            new PdfReader().parseFileItems(pdfPath, (err, item) => {
                if (err) return reject(err);
                if (!item) return resolve();
                if (item.text) data.push(item.text);
            });
        });

        const transactions = fetchTransactionData(data);

        res.status(200).json({ transactions });
    } catch (error) {
        res.status(400).json({ error: "Server Error while extracting transactions: " + error.message });
    } finally {
        fs.unlink(pdfPath, () => { });
    }
}

exports.uploadBulkTransactions = async (req, res) => {
    const userId = req.userId;
    const transactions = req.body.transactions;

    if (!Array.isArray(transactions) || transactions.length === 0) {
        return res.status(400).json({ error: "Transactions must be a non-empty array." });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const normalizedTransactions = [];
        for (let i = 0; i < transactions.length; i++) {
            const txn = transactions[i];
            const remarksTrimmed = txn.remarks?.trim();
            const indexLabel = `Transaction #${i + 1}`;

            try {
                // Required fields
                validateRequiredTransactionFields(txn, ["amount", "type", "date", "remarks", "categoryId"]);

                // Field validators
                validateTransactionType(txn.type);
                validateTransactionAmount(txn.amount);
                const txnDate = normalizeDate(validateTransactionDate(txn.date));
                validateTransactionRemarks(remarksTrimmed);
                await validateTransactionCategoryId(txn.categoryId, userId);

                if (txn.subcategoryId) {
                    await validateTransactionSubcategoryId(txn.subcategoryId, txn.categoryId, userId);
                }

                const duplicate = await TransactionModel.findOne({
                    userId,
                    type: txn.type,
                    amount: txn.amount,
                    date: txnDate,
                    remarks: { $regex: new RegExp(`^${remarksTrimmed}$`, "i") },
                });

                if (duplicate) {
                    throw new Error("Duplicate transaction detected.");
                }

                // If everything is valid
                normalizedTransactions.push({
                    userId,
                    amount: txn.amount,
                    type: txn.type,
                    date: txnDate,
                    remarks: remarksTrimmed,
                    categoryId: txn.categoryId,
                    subcategoryId: txn.subcategoryId || null,
                });
            } catch (error) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({
                    error: `${indexLabel}: ${error.message}`,
                });
            }
        }

        // All valid - now insert all
        await TransactionModel.insertMany(normalizedTransactions, { session });
        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({
            message: `${normalizedTransactions.length} transaction(s) added successfully.`,
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({
            error: "Server Error while uploading transactions: " + error.message,
        });
    }
}