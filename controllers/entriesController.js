const mongoose = require("mongoose");
const Entry = require("../models/Entry");
const Head = require("../models/Head");
const { normalizeDate } = require("./utils/formatters");

/**
 * Controller to create a new daily entry for a user.
 * Expects req.userId from verifyJWT middleware
 * Body: { date: string (ISO), entries: [{ headId, serial, amount, type }] }
 */
exports.createEntry = async (req, res) => {
    try {
        const { date, entries } = req.body;
        const userId = req.userId;

        // Basic input validations
        if (!date) {
            return res.status(400).json({ error: "Date is required." });
        }
        let entryDate = new Date(date);
        if (isNaN(entryDate.getTime())) {
            return res.status(400).json({ error: "Invalid date format." });
        }
        entryDate = normalizeDate(entryDate);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (entryDate > today) {
            return res.status(400).json({ error: "Date cannot be in the future." });
        }

        if (!Array.isArray(entries) || entries.length === 0) {
            return res.status(400).json({ error: "Entries array is required and cannot be empty." });
        }

        // Ensure date is not already used
        const existing = await Entry.findOne({ userId, date: entryDate });
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

        // Serial continuity check
        const expectedSerials = Array.from({ length: entries.length }, (_, idx) => idx + 1);
        for (const serial of expectedSerials) {
            if (!serialSet.has(serial)) {
                return res.status(400).json({ message: `Missing serial number: ${serial}.` });
            }
        }

        // Verify headIds belong to the user
        const uniqueHeadIds = [...new Set(headIds)];
        const count = await Head.countDocuments({
            _id: { $in: uniqueHeadIds },
            userId
        });
        if (count !== uniqueHeadIds.length) {
            return res.status(400).json({ message: "One or more head ids are invalid or do not exist." });
        }

        // Create entry
        const newEntry = new Entry({
            userId,
            date: entryDate,
            entries
        });

        await newEntry.save();
        return res.status(201).json({ message: "Entry created successfully.", entry: newEntry });

    } catch (error) {
        console.error("Error creating entry:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

/**
 * Get all entries for the authenticated user.
 * Returns array of { _id, date }
 */
exports.getAllDaywiseEntries = async (req, res) => {
    try {
        const userId = req.userId;

        const daywiseEntries = await Entry.find({ userId })
            .select("_id date")
            .sort({ date: -1 }); // newest first

        return res.status(200).json(daywiseEntries);
    } catch (error) {
        console.error("Error fetching all daywise entries:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

/**
 * Get entry items by entry ID (and optionally validate date)
 * Returns { date, entries }
 */
exports.getEntryItemsForId = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const { date } = req.query;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid or missing entry ID." });
        }

        const entry = await Entry.findOne({ _id: id, userId });
        if (!entry) {
            return res.status(404).json({ message: "Entry not found." });
        }

        // Optional date consistency check
        if (date) {
            const requestDate = new Date(date);
            requestDate.setHours(0, 0, 0, 0);
            const entryDate = new Date(entry.date);
            entryDate.setHours(0, 0, 0, 0);

            if (requestDate.getTime() !== entryDate.getTime()) {
                return res.status(400).json({
                    message: "Date does not match entry ID."
                });
            }
        }

        return res.status(200).json({
            date: entry.date,
            entries: entry.entries
        });
    } catch (error) {
        console.error("Error fetching entry items:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};
