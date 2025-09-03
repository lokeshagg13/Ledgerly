const mongoose = require("mongoose");
const EntrySet = require("../models/entrySet");
const Head = require("../models/head");
const { normalizeDate } = require("./utils/formatters");

exports.getBalanceSummaryForHeads = async (req, res) => {
    const userId = req.userId;
    let { mode = "all", from, to } = req.query;
    const validModes = ["all", "filtered"];
    if (!validModes.includes(mode)) {
        return res.status(400).json({ error: `Invalid mode for fetching balance summary: ${mode}` });
    }
    try {
        const filter = { userId };
        if (mode === "filtered") {
            if (from && isNaN(Date.parse(from))) {
                return res.status(400).json({ error: "Invalid 'from' date format." });
            }
            if (to && isNaN(Date.parse(to))) {
                return res.status(400).json({ error: "Invalid 'to' date format." });
            }
            const fromDate = from ? normalizeDate(from) : null;
            const toDate = to ? normalizeDate(to, "dayEnd") : null;

            if (fromDate && toDate) {
                if (fromDate > toDate) {
                    return res.status(400).json({ error: "'from' date cannot be after 'to' date." });
                }
                filter.date = {
                    $gte: fromDate,
                    $lt: toDate,
                };
            } else if (fromDate) {
                filter.date = { $gte: fromDate };
            } else if (toDate) {
                filter.date = { $lt: toDate };
            }
        }
        const heads = await Head.find({ userId }).lean();
        if (!heads.length) {
            return res.status(200).json({ summary: [] });
        }
        const entriesAgg = await EntrySet.aggregate([
            { $match: filter },
            { $unwind: "$entries" },
            {
                $group: {
                    _id: "$entries.headId",
                    totalCredit: {
                        $sum: {
                            $cond: [{ $eq: ["$entries.type", "credit"] }, "$entries.amount", 0]
                        }
                    },
                    totalDebit: {
                        $sum: {
                            $cond: [{ $eq: ["$entries.type", "debit"] }, "$entries.amount", 0]
                        }
                    }
                }
            }
        ]);
        console.log(entriesAgg);
        const headTotalsMap = {};
        for (const item of entriesAgg) {
            headTotalsMap[item._id.toString()] = {
                credit: item.totalCredit,
                debit: item.totalDebit
            };
        }
        const summary = heads.map(head => {
            const headIdStr = head._id.toString();
            const openingBalanceAmount = head.openingBalance.amount || 0;
            const openingBalanceDate = head.openingBalance.lastUpdated;
            const totals = headTotalsMap[headIdStr] || { credit: 0, debit: 0 };
            const calculatedBalance =
                openingBalanceAmount + totals.credit - totals.debit;

            return {
                headId: head._id,
                headName: head.name,
                openingBalance: {
                    amount: openingBalanceAmount,
                    date: openingBalanceDate
                },
                calculatedBalance
            };
        });

        return res.status(200).json({ summary });
    } catch (error) {
        return res.status(500).json({ error: "Server Error while fetching balance summary for heads: " + error.message });
    }
};
