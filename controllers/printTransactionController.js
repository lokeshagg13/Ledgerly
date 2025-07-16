const mongoose = require("mongoose");
const UserModel = require("../models/User");
const TransactionModel = require("../models/Transaction");
const { normalizeDate, formatTransactions } = require("./utils/formatters");
const { generateCAPreviewImages, generateTablePreviewImages } = require("./utils/printHelper");

exports.getTransactionsWithPrintPreview = async (req, res) => {
    const userId = req.userId;
    const {
        mode = "all",
        limit = 10,
        from, to, categoryIds, type, sortBy
    } = req.query;

    const keepCreditDebitTxnSeparate = req.query?.keepCreditDebitTxnSeparate === "true";

    const validModes = ["all", "recent", "filtered"];
    if (!validModes.includes(mode)) {
        return res.status(400).json({ error: `Invalid mode for fetching transactions: ${mode}` });
    }
    try {
        const filter = { userId };

        // Add filters if in filtered mode
        if (mode === "filtered") {
            if (from && isNaN(Date.parse(from))) {
                return res.status(400).json({ error: "Invalid 'from' date format." });
            }
            if (to && isNaN(Date.parse(to))) {
                return res.status(400).json({ error: "Invalid 'to' date format." });
            }

            const fromDate = from ? normalizeDate(from) : null;
            const toDate = to ? normalizeDate(to, "dayEnd") : null;

            if (fromDate && toDate && fromDate > toDate) {
                return res.status(400).json({ error: "'from' date cannot be after 'to' date." });
            }

            if (fromDate || toDate) {
                filter.date = {};
                if (fromDate) filter.date.$gte = fromDate;
                if (toDate) filter.date.$lt = toDate;
            }

            if (categoryIds) {
                const categoryIdsArray = Array.isArray(categoryIds)
                    ? categoryIds
                    : categoryIds.split(",");
                filter.categoryId = {
                    $in: categoryIdsArray.filter((id) => mongoose.Types.ObjectId.isValid(id)),
                };
            }

            if (type) {
                if (!["credit", "debit"].includes(type)) {
                    return res.status(400).json({ error: `Invalid transaction type: ${type}` });
                }
                filter.type = type;
            }
        }

        const query = TransactionModel.find(filter);

        // Add limit if in recent mode
        if (mode === "recent") {
            const safeLimit = Math.max(1, Math.min(parseInt(limit) || 10, 50));
            query.limit(safeLimit);
        }

        // Sort the transactions
        if (sortBy === "amountDesc") {
            query.sort({ amount: -1 });
        } else if (sortBy === "amountAsc") {
            query.sort({ amount: 1 });
        } else if (sortBy === "dateDesc") {
            query.sort({ date: -1 });
        } else {
            query.sort({ date: 1 });
        }

        // Run the query
        const transactions = await query
            .lean()
            .populate("categoryId", "name")
            .populate("subcategoryId", "name");

        // Format results
        const formattedTransactions = formatTransactions(transactions);

        // Fetch user name from DB
        const user = await UserModel.findById(userId).select("name").lean();
        const userName = user?.name || null;

        // Get CA Style preview images
        const caImageBuffers = generateCAPreviewImages(formattedTransactions, userName, keepCreditDebitTxnSeparate);
        const caBase64Images = caImageBuffers.map(buf => `data:image/png;base64,${buf.toString("base64")}`);

        // Get Table style preview images
        const tableImageBuffers = generateTablePreviewImages(formattedTransactions, userName, keepCreditDebitTxnSeparate);
        const tableBase64Images = tableImageBuffers.map(buf => `data:image/png;base64,${buf.toString("base64")}`);

        return res.status(200).json({
            transactions: formattedTransactions,
            caPreviewImages: caBase64Images,
            tablePreviewImages: tableBase64Images,
        });
    } catch (error) {
        return res.status(500).json({ error: "Error fetching transactions and generating print preview: " + error.message });
    }
};

// const formattedTransactions = [];

// const numAdd = 500;
// for (let i = 0; i < numAdd; i++) {
//     formattedTransactions.push({
//         _id: `${i}1 `,
//         type: "debit",
//         amount: 100000000000,
//         categoryName: "RandomCategoryOf20Ch",
//         subcategoryName: "RandomSubcategoryOf2",
//         date: "2022-02-01",
//     });
// }

// const numAdd2 = 125;
// for (let i = 0; i < numAdd2; i++) {
//     formattedTransactions.push({
//         _id: `${i}2`,
//         type: "credit",
//         amount: 900000000000,
//         categoryName: "RandomCategoryOf20Ch",
//         subcategoryName: "RandomSubcategoryOf2",
//         date: "2022-02-01",
//     });
// }

