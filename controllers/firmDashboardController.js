const mongoose = require("mongoose");
const EntrySetModel = require("../models/EntrySet");   // Adjust path as needed
const UserModel = require("../models/User"); // Adjust path as needed

/**
 * Get current balance for logged-in user
 * openingBalance + sum(credits) - sum(debits)
 * Also returns latest entry date
 */
exports.getCurrentBalance = async (req, res) => {
    try {
        const userId = req.userId; // assuming this is set by your auth middleware

        // 1. Get the user's opening balance
        const user = await UserModel.findById(userId).select("openingBalance");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const openingBalance = user.openingBalance?.amount || 0;

        // 2. Aggregate all credits and debits from entries
        const result = await EntrySetModel.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            { $unwind: "$entries" },
            {
                $group: {
                    _id: "$entries.type",
                    total: { $sum: "$entries.amount" }
                }
            }
        ]);

        let totalCredits = 0;
        let totalDebits = 0;
        result.forEach(r => {
            if (r._id === "credit") totalCredits = r.total;
            else if (r._id === "debit") totalDebits = r.total;
        });

        // 3. Get latest entry date
        const latestEntry = await EntrySetModel.findOne({ userId })
            .sort({ date: -1 })
            .select("date")
            .lean();

        const latestDate = latestEntry ? latestEntry.date : null;

        // 4. Compute balance
        const currentBalance = openingBalance + totalCredits - totalDebits;

        return res.status(200).json({
            balance: currentBalance,
            latestEntryDate: latestDate
        });

    } catch (err) {
        console.error("Error in getCurrentBalance:", err);
        return res.status(500).json({ message: "Server error" });
    }
};
