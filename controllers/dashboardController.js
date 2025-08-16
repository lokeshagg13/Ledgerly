const mongoose = require("mongoose");
const TransactionModel = require("../models/Transaction");
const UserModel = require("../models/User");
const { normalizeDate } = require("./utils/formatters");

async function computeBalance({ userId, uptoDate, selectedCategories, openingBalance }) {
    const filterQuery = { userId };

    let hasUptoDate = false;
    let hasCategoryFilter = false;

    if (uptoDate) {
        if (isNaN(Date.parse(uptoDate))) {
            throw new Error("Invalid 'uptoDate' format.");
        }
        filterQuery.date = { $lt: normalizeDate(uptoDate, "dayEnd") };
        hasUptoDate = true;
    }

    if (Array.isArray(selectedCategories) && selectedCategories.length > 0) {
        const categoryIdList = Array.isArray(selectedCategories)
            ? selectedCategories
            : selectedCategories.split(",");
        filterQuery.categoryId = {
            $in: categoryIdList
                .filter((id) => mongoose.Types.ObjectId.isValid(id))
        }
        hasCategoryFilter = true;
    }

    const result = await TransactionModel.aggregate([
        { $match: filterQuery },
        {
            $group: {
                _id: "$type",
                total: { $sum: "$amount" },
            },
        },
    ]);

    let credit = 0, debit = 0;
    result.forEach((item) => {
        if (item._id === "credit") credit = item.total;
        if (item._id === "debit") debit = item.total;
    });

    let balance = credit - debit;
    if (!hasCategoryFilter) {
        balance += openingBalance || 0;
    }
    const balanceFixed = parseFloat(balance.toFixed(2));

    let latestTxnDate = null;
    if (!hasUptoDate) {
        const latestTxn = await TransactionModel.findOne({ userId }).sort({ date: -1 }).select("date");
        latestTxnDate = latestTxn?.date || null;
    }

    return {
        balance: balanceFixed,
        latestTxnDate
    };
}

// @desc    Get user's overall balance and latest txn date
// @route   GET /api/dashboard/overallBalance
// @access  Private
exports.getOverallBalance = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId).select("openingBalance");
        if (!user) return res.status(404).json({ error: "User not found" });

        const { balance, latestTxnDate } = await computeBalance({
            userId: user._id,
            openingBalance: user.openingBalance?.amount
        });

        res.status(200).json({
            balance, latestTxnDate
        });
    } catch (error) {
        res.status(500).json({ error: error.message || "Server error while fetching overall balance" });
    }
};

// @desc    Get user's current balance and last updated date
// @route   GET /api/dashboard/custom/balance
// @access  Private
exports.getCustomBalance = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId).select("customBalanceCard openingBalance");
        if (!user) return res.status(404).json({ error: "User not found" });

        const filters = user.customBalanceCard?.filters || {};

        const { balance, latestTxnDate } = await computeBalance({
            userId: user._id,
            uptoDate: filters?.uptoDate,
            selectedCategories: filters?.selectedCategories,
            openingBalance: user.openingBalance?.amount
        });

        res.status(200).json({
            balance,
            latestTxnDate,
            uptoDate: filters?.uptoDate,
            selectedCategories: filters?.selectedCategories,
        });
    } catch (error) {
        res.status(500).json({ error: error.message || "Server error while fetching custom balance" });
    }
};

// @desc    Get custom balance card title
// @route   GET /api/dashboard/custom/title
// @access  Private
exports.getCustomBalanceCardTitle = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId).select("customBalanceCard");
        if (!user) return res.status(404).json({ error: "User not found" });
        const title = user.customBalanceCard?.title?.trim() || "Filtered Balance";
        return res.status(200).json({ title });
    } catch (error) {
        return res.status(500).json({ error: "Server error while fetching title" });
    }
};

// @desc    Update filters for the user's custom balance card
// @route   PUT /api/dashboard/custom/filters
// @access  Private
exports.updateCustomBalanceCardFilters = async (req, res) => {
    try {
        const userId = req.userId;
        const { uptoDate, selectedCategories } = req.body;

        // Validate 'uptoDate' if present
        let uptoDateObj = null;
        if (uptoDate) {
            if (isNaN(Date.parse(uptoDate))) {
                return res.status(400).json({ error: "Invalid 'uptoDate' format." });
            }
            uptoDateObj = new Date(uptoDate);
        }

        // Validate selectedCategories
        if (selectedCategories && !Array.isArray(selectedCategories)) {
            return res.status(400).json({ error: "'selectedCategories' must be an array." });
        }

        // Check for user's existence
        const user = await UserModel.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found." });

        if (!user.customBalanceCard) {
            user.customBalanceCard = {
                title: "Filtered Balance",
                filters: {}
            };
        }

        user.customBalanceCard.filters = {
            ...(uptoDateObj && { uptoDate: uptoDateObj }),
            selectedCategories: selectedCategories || [],
        };

        await user.save();

        res.status(200).json({ message: "Custom balance card filters updated." });
    } catch (error) {
        res.status(500).json({ error: "Server error while updating filters." });
    }
};

// @desc    Update title for the user's custom balance card
// @route   PUT /api/dashboard/custom/title
// @access  Private
exports.updateCustomBalanceCardTitle = async (req, res) => {
    try {
        const userId = req.userId;
        const { title } = req.body;

        if (!title || typeof title !== "string" || title.trim() === "") {
            return res.status(400).json({ error: "Title is required and must be a non-empty string." });
        }

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        if (!user.customBalanceCard) {
            user.customBalanceCard = {
                title: title.trim(),
                filters: {
                    uptoDate: null,
                    selectedCategories: []
                }
            };
        } else {
            user.customBalanceCard.title = title.trim();
        }

        await user.save();

        return res.status(200).json({ message: "Custom balance card title updated." });
    } catch (error) {
        res.status(500).json({ error: "Server error while updating title." });
    }
};

// @desc    Get cumulative daily balance series for line chart
// @route   GET /api/dashboard/balance/daily-series
// @access  Private
exports.getDailyBalanceSeries = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId).select("openingBalance createdAt");
        if (!user) return res.status(404).json({ error: "User not found" });

        const openingBalance = user.openingBalance?.amount || 0;

        // 1. Get first and last transaction dates
        const firstTxn = await TransactionModel.findOne({ userId: user._id })
            .sort({ date: 1 })
            .select("date");
        const lastTxn = await TransactionModel.findOne({ userId: user._id })
            .sort({ date: -1 })
            .select("date");

        if (!firstTxn || !lastTxn) {
            // No transactions: just return opening balance as a single point
            return res.status(200).json([
                {
                    date: normalizeDate(user.createdAt || new Date(), "dayStart"),
                    balance: parseFloat(openingBalance.toFixed(2))
                }
            ]);
        }

        // 2. Start date = 5 days before firstTxn.date
        const startDate = new Date(firstTxn.date);
        startDate.setDate(startDate.getDate() - 5);

        // 3. Fetch all transactions sorted by date ascending
        const transactions = await TransactionModel.find({
            userId: user._id,
            date: { $gte: startDate, $lte: lastTxn.date }
        })
            .sort({ date: 1 })
            .lean();

        // 4. Initialize map for daily totals
        const dailyTotals = {};
        transactions.forEach(txn => {
            const day = normalizeDate(txn.date, "dayStart");
            if (!dailyTotals[day]) {
                dailyTotals[day] = { credit: 0, debit: 0 };
            }
            if (txn.type === "credit") {
                dailyTotals[day].credit += txn.amount;
            } else if (txn.type === "debit") {
                dailyTotals[day].debit += txn.amount;
            }
        });

        // 5. Iterate day by day and compute cumulative balance
        const series = [];
        let currentBalance = openingBalance;
        const cursorDate = new Date(startDate);
        const endDate = normalizeDate(lastTxn.date, "dayStart");

        while (cursorDate <= endDate) {
            const dayStr = normalizeDate(cursorDate, "dayStart");
            const totals = dailyTotals[dayStr] || { credit: 0, debit: 0 };

            currentBalance += totals.credit - totals.debit;

            series.push({
                date: dayStr,
                balance: parseFloat(currentBalance.toFixed(2))
            });

            // Move to next day
            cursorDate.setDate(cursorDate.getDate() + 1);
        }

        return res.status(200).json(series);

    } catch (error) {
        console.error("Error generating daily balance series:", error);
        res.status(500).json({ error: "Server error while generating daily balance series" });
    }
};