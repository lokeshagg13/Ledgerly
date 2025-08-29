const mongoose = require("mongoose");
const EntrySetModel = require("../models/EntrySet");
const HeadModel = require("../models/Head");
const { normalizeDate } = require("./utils/formatters");

/**
 * Controller to create a new daily entry set for a user.
 * Expects req.userId from verifyJWT middleware
 * Body: { date: string (ISO), entries: [{ headId, serial, amount, type }] }
 */
exports.createEntrySet = async (req, res) => {
    try {
        const { date, entries, balance } = req.body;
        const userId = req.userId;

        // Basic input validations
        if (!date) {
            return res.status(400).json({ error: "Date is required." });
        }
        let entrySetDate = new Date(date);
        if (isNaN(entrySetDate.getTime())) {
            return res.status(400).json({ error: "Invalid date format." });
        }
        entrySetDate = normalizeDate(entrySetDate);

        const today = normalizeDate(new Date());
        if (entrySetDate > today) {
            return res.status(400).json({ error: "Date cannot be in the future." });
        }

        if (!Array.isArray(entries) || entries.length === 0) {
            return res.status(400).json({ error: "Entries array is required and cannot be empty." });
        }

        // Ensure date is not already used
        const existing = await EntrySetModel.findOne({ userId, date: entrySetDate });
        if (existing) {
            return res.status(400).json({ error: "An entry already exists for this date." });
        }

        // Validate each entry
        const serialSet = new Set();
        const headIds = [];

        for (let i = 0; i < entries.length; i++) {
            const item = entries[i];
            const { headId, serial, amount, type } = item;

            // Required field checks
            if (!headId || !serial || amount == null || !type) {
                return res.status(400).json({ error: `All fields are required for entry index ${i}.` });
            }

            // Serial must be integer and positive
            if (!Number.isInteger(serial) || serial < 1) {
                return res.status(400).json({ error: `Serial must be a positive integer (index ${i}).` });
            }
            if (serialSet.has(serial)) {
                return res.status(400).json({ message: `Duplicate serial number found: ${serial}.` });
            }
            serialSet.add(serial);

            // Amount validation
            if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
                return res.status(400).json({ message: `Amount must be a positive number (index ${i}).` });
            }
            if (amount > 1e9) { // 100 crore = 1,000,000,000
                return res.status(400).json({ message: `Amount exceeds maximum limit (100 crore) at index ${i}.` });
            }

            // Type validation
            if (!["credit", "debit"].includes(type)) {
                return res.status(400).json({ message: `Invalid type: ${type} (index ${i}). Must be credit or debit.` });
            }

            // HeadId validation format
            if (!mongoose.Types.ObjectId.isValid(headId)) {
                return res.status(400).json({ message: `Invalid headId format (index ${i}).` });
            }

            headIds.push(headId);
        }

        // Validate balance
        if (!balance) {
            return res.status(400).json({ error: "Balance is required." });
        }

        // Serial continuity check
        const expectedSerials = Array.from({ length: entries.length }, (_, idx) => idx + 1);
        for (const serial of expectedSerials) {
            if (!serialSet.has(serial)) {
                return res.status(400).json({ message: `Missing serial number: ${serial}.` });
            }
        }

        // Verify headIds belong to the user
        const uniqueHeadIds = [...new Set(headIds)];
        const count = await HeadModel.countDocuments({
            _id: { $in: uniqueHeadIds },
            userId
        });
        if (count !== uniqueHeadIds.length) {
            return res.status(400).json({ message: "One or more head ids are invalid or do not exist." });
        }

        // Create entry
        const newEntry = new EntrySetModel({
            userId,
            date: entrySetDate,
            entries,
            balance
        });

        await newEntry.save();
        return res.status(201).json({ message: "Entry created successfully.", entry: newEntry });

    } catch (error) {
        console.error("Error creating entry:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

/**
 * Get all entry sets for the authenticated user.
 * Returns array of { _id, date }
 */
exports.getAllEntrySets = async (req, res) => {
    try {
        const userId = req.userId;

        const entrySets = await EntrySetModel.find({ userId })
            .select("_id date")
            .sort({ date: -1 });

        return res.status(200).json(entrySets);
    } catch (error) {
        console.error("Error fetching all daywise entries:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

/**
 * Get entries by entry set ID (and optionally validate entry set date)
 * Returns { date, entries }
 */
exports.getAllEntriesForEntrySet = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const { date } = req.query;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid or missing entry ID." });
        }

        const entrySet = await EntrySetModel.findOne({ _id: id, userId });
        if (!entrySet) {
            return res.status(404).json({ message: "Entry set not found." });
        }

        if (date) {
            const requestDate = new Date(date);
            requestDate.setHours(0, 0, 0, 0);
            const entrySetDate = new Date(entrySet.date);
            entrySetDate.setHours(0, 0, 0, 0);

            if (requestDate.getTime() !== entrySetDate.getTime()) {
                return res.status(400).json({
                    message: "Date does not match entry ID."
                });
            }
        }

        return res.status(200).json({
            date: entrySet.date,
            entries: entrySet.entries,
            balance: entrySet.balance
        });
    } catch (error) {
        console.error("Error fetching entries for an entry set:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

/**
 * Update entries and balance of an entry set (date cannot be updated)
 * Expects req.params.id as entrySetId
 * Body: { entries: [{ headId, serial, amount, type }], balance }
 */
exports.updateEntrySet = async (req, res) => {
    try {
        const { id } = req.params;
        const { entries, balance } = req.body;
        const userId = req.userId;

        // Validate entrySetId
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid or missing entrySetId." });
        }

        // Fetch entry set first to confirm ownership and existence
        const entrySet = await EntrySetModel.findOne({ _id: id, userId });
        if (!entrySet) {
            return res.status(404).json({ error: "Entry set not found." });
        }

        // Validate entries
        if (!Array.isArray(entries) || entries.length === 0) {
            return res.status(400).json({ error: "Entries array is required and cannot be empty." });
        }

        const serialSet = new Set();
        const headIds = [];

        for (let i = 0; i < entries.length; i++) {
            const item = entries[i];
            const { headId, serial, amount, type } = item;

            // Required field checks
            if (!headId || !serial || amount == null || !type) {
                return res.status(400).json({ error: `All fields are required for entry index ${i}.` });
            }

            // Serial must be integer and positive
            if (!Number.isInteger(serial) || serial < 1) {
                return res.status(400).json({ error: `Serial must be a positive integer (index ${i}).` });
            }
            if (serialSet.has(serial)) {
                return res.status(400).json({ message: `Duplicate serial number found: ${serial}.` });
            }
            serialSet.add(serial);

            // Amount validation
            if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
                return res.status(400).json({ message: `Amount must be a positive number (index ${i}).` });
            }
            if (amount > 1e9) {
                return res.status(400).json({ message: `Amount exceeds maximum limit (100 crore) at index ${i}.` });
            }

            // Type validation
            if (!["credit", "debit"].includes(type)) {
                return res.status(400).json({ message: `Invalid type: ${type} (index ${i}). Must be credit or debit.` });
            }

            // HeadId validation format
            if (!mongoose.Types.ObjectId.isValid(headId)) {
                return res.status(400).json({ message: `Invalid headId format (index ${i}).` });
            }

            headIds.push(headId);
        }

        // Validate balance
        if (balance == null) {
            return res.status(400).json({ error: "Balance is required." });
        }

        // Serial continuity check
        const expectedSerials = Array.from({ length: entries.length }, (_, idx) => idx + 1);
        for (const serial of expectedSerials) {
            if (!serialSet.has(serial)) {
                return res.status(400).json({ message: `Missing serial number: ${serial}.` });
            }
        }

        // Verify headIds belong to the user
        const uniqueHeadIds = [...new Set(headIds)];
        const count = await HeadModel.countDocuments({
            _id: { $in: uniqueHeadIds },
            userId
        });
        if (count !== uniqueHeadIds.length) {
            return res.status(400).json({ message: "One or more head ids are invalid or do not exist." });
        }

        // Perform update (date remains unchanged)
        entrySet.entries = entries;
        entrySet.balance = balance;
        await entrySet.save();

        return res.status(200).json({
            message: "Entry set updated successfully.",
            entry: entrySet
        });

    } catch (error) {
        console.error("Error updating entry set:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

/**
 * Delete single entry set by entry set ID
 */
exports.deleteSingleEntrySet = async (req, res) => {
    try {
        const { entrySetId } = req.params;

        if (!entrySetId || !mongoose.Types.ObjectId.isValid(entrySetId)) {
            return res.status(400).json({ error: "Invalid or missing entrySetId." });
        }

        const deleted = await EntrySetModel.findOneAndDelete({
            _id: entrySetId,
            userId: req.userId
        });

        if (!deleted) {
            return res.status(404).json({ error: "Entry set not found." });
        }

        return res.status(200).json({ message: "Entry set deleted successfully." });
    } catch (error) {
        console.error("Error deleting single entry set:", error);
        res.status(500).json({ error: "Error deleting entry set: " + error.message });
    }
};

/**
 * Delete multiple entry sets by entry set IDs
 */
exports.deleteMultipleEntrySets = async (req, res) => {
    try {
        let { entrySetIds } = req.body;

        if (!entrySetIds) {
            return res.status(400).json({ error: "entrySetIds is required." });
        }
        if (!Array.isArray(entrySetIds)) {
            entrySetIds = [entrySetIds];
        }

        // Filter out invalid ObjectIds to avoid runtime errors
        entrySetIds = entrySetIds.filter(id => mongoose.Types.ObjectId.isValid(id));
        if (entrySetIds.length === 0) {
            return res.status(400).json({ error: "No valid entrySetIds provided." });
        }

        const deletedResult = await EntrySetModel.deleteMany({
            _id: { $in: entrySetIds },
            userId: req.userId
        });

        if (deletedResult.deletedCount === 0) {
            return res.status(404).json({ error: "No matching entry sets found to delete." });
        }

        return res.status(200).json({
            success: true,
            message: `${deletedResult.deletedCount} entry set(s) deleted successfully.`
        });
    } catch (error) {
        console.error("Error deleting multiple entry sets:", error);
        res.status(500).json({ error: "Error deleting entry sets: " + error.message });
    }
};



