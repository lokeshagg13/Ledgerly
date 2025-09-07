const mongoose = require("mongoose");
const EntrySetModel = require("../models/EntrySet");   // Adjust path as needed
const UserModel = require("../models/User"); // Adjust path as needed

/**
 * Get current balance for logged-in user
 * - If entry sets exist: return balance from the latest entry set
 * - If no entry sets exist: return opening balance from user
 */
exports.getCurrentBalance = async (req, res) => {
    try {
        const userId = req.userId; // assuming this is set by your auth middleware

        // 1. Get the user's opening balance
        const user = await UserModel.findById(userId).select("openingBalance");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const openingBalance = user.openingBalance?.amount || 0;

        // 2. Find the latest entry set
        const latestEntrySet = await EntrySetModel.findOne({ userId })
            .sort({ date: -1 })
            .select("balance date")
            .lean();

        // 3. Decide balance
        const currentBalance = latestEntrySet ? latestEntrySet.balance : openingBalance;
        const latestDate = latestEntrySet ? latestEntrySet.date : null;

        return res.status(200).json({
            balance: currentBalance,
            latestEntryDate: latestDate
        });

    } catch (error) {
        return res.status(500).json({ error: "Server Error while fetching current balance: " + error.message });
    }
};
