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
        if (!user) return res.status(404).json({ message: "User not found" });

        const { balance, latestTxnDate } = await computeBalance({
            userId: user._id,
            openingBalance: user.openingBalance?.amount
        });

        res.status(200).json({
            balance, latestTxnDate
        });
    } catch (error) {
        res.status(500).json({ message: error.message || "Server error while fetching overall balance" });
    }
};

// @desc    Get user's current balance and last updated date
// @route   GET /api/dashboard/custom/balance
// @access  Private
exports.getCustomBalance = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId).select("customBalanceCard openingBalance");
        if (!user) return res.status(404).json({ message: "User not found" });

        const filters = user.customBalanceCard?.filters;

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
        res.status(500).json({ message: error.message || "Server error while fetching custom balance" });
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

        const update = {
            "customBalanceCard.filters": {
                ...(uptoDateObj && { uptoDate: uptoDateObj }),
                selectedCategories: selectedCategories || [],
            },
        };

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { $set: update },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found." });
        }

        res.status(200).json({ message: "Custom balance card filters updated." });
    } catch (error) {
        res.status(500).json({ message: "Server error while updating filters." });
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

        const update = {
            "customBalanceCard.title": title.trim(),
        };

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { $set: update },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found." });
        }

        res.status(200).json({ message: "Custom balance card title updated." });
    } catch (error) {
        res.status(500).json({ message: "Server error while updating title." });
    }
};

