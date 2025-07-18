const Transaction = require("../models/Transaction");

// @desc    Get user's current balance and last updated date
// @route   GET /api/dashboard/balance
// @access  Private
exports.getBalance = async (req, res) => {
    try {
        const userId = req.userId;

        const result = await Transaction.aggregate([
            { $match: { userId } },
            {
                $group: {
                    _id: "$type",
                    total: { $sum: "$amount" },
                },
            },
        ]);

        let credit = 0;
        let debit = 0;

        result.forEach((item) => {
            if (item._id === "credit") credit = item.total;
            if (item._id === "debit") debit = item.total;
        });

        const balance = credit - debit;

        const latestTransaction = await Transaction.findOne({ userId })
            .sort({ date: -1 })
            .select("date");

        const lastUpdated = latestTransaction?.date || null;

        res.status(200).json({
            balance,
            lastUpdated,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error while fetching balance" });
    }
};