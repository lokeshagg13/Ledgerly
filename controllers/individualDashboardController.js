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
// @route   GET /api/user/dashboard/overallBalance
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
// @route   GET /api/user/dashboard/custom/balance
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
// @route   GET /api/user/dashboard/custom/title
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
// @route   PUT /api/user/dashboard/custom/filters
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
// @route   PUT /api/user/dashboard/custom/title
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

// @desc    Get list of financial years from user's transaction data
// @route   GET /api/user/dashboard/financial-years
// @access  Private
exports.getFinancialYears = async (req, res) => {
    try {
        const userId = req.userId;

        // Fetch only the transaction dates for efficiency
        const transactions = await TransactionModel.find({ userId }).select("date").lean();

        if (!transactions.length) {
            return res.status(200).json([]);
        }

        // Helper to get financial year label
        const getFinancialYearLabel = (date) => {
            const d = new Date(date);
            const year = d.getFullYear();
            const month = d.getMonth();

            const fyStart = month < 3 ? year - 1 : year;
            const fyEnd = fyStart + 1;

            return `${fyStart}-${fyEnd.toString().slice(-2)}`;
        };

        const yearSet = new Set();
        transactions.forEach(txn => {
            yearSet.add(getFinancialYearLabel(txn.date));
        });

        const years = Array.from(yearSet).sort((a, b) => {
            // Sort by first year in string
            const aYear = parseInt(a.split("-")[0], 10);
            const bYear = parseInt(b.split("-")[0], 10);
            return aYear - bYear;
        });

        res.status(200).json(years);

    } catch (error) {
        console.error("Error fetching financial years:", error);
        res.status(500).json({ error: "Server error while fetching financial years." });
    }
};

// @desc    Get cumulative daily balance series for a given financial year
// @route   GET /api/user/dashboard/series/dailyBalance?fy=2023-24
// @access  Private
exports.getDailyBalanceSeries = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId).select("openingBalance createdAt");
        if (!user) return res.status(404).json({ error: "User not found" });

        const openingBalance = user.openingBalance?.amount || 0;

        const { fy } = req.query;
        if (!fy || !/^\d{4}-\d{2}$/.test(fy)) {
            return res.status(400).json({ error: "Invalid or missing financial year format. Use YYYY-MM." });
        }

        // Parse FY string into start and end dates
        const [startYearStr, endYearSuffix] = fy.split("-");
        const startYear = parseInt(startYearStr, 10);
        const endYear = parseInt(startYearStr.slice(0, 2) + endYearSuffix, 10);

        const startDate = new Date(startYear, 3, 1); // Apr 1
        const endDate = new Date(endYear, 2, 31, 23, 59, 59, 999); // Mar 31

        // 1. Find user's last transaction date
        const lastTxn = await TransactionModel.findOne({ userId: user._id })
            .sort({ date: -1 })
            .select("date");
        const lastTxnDate = lastTxn?.date;
        if (!lastTxnDate) {
            // no transactions ever → return just opening balance at FY start
            return res.status(200).json([
                { date: normalizeDate(startDate, "dayStart"), balance: parseFloat(openingBalance.toFixed(2)) }
            ]);
        }

        // 2. Clamp FY end to last transaction date if it's earlier
        const effectiveEndDate = lastTxnDate < endDate ? lastTxnDate : endDate;

        // 3. If last transaction is before this FY → no data for this FY
        if (lastTxnDate < startDate) {
            return res.status(200).json([
                { date: normalizeDate(startDate, "dayStart"), balance: parseFloat(openingBalance.toFixed(2)) }
            ]);
        }

        // 4. Get cumulative balance up to FY start
        const priorAgg = await TransactionModel.aggregate([
            {
                $match: {
                    userId: user._id,
                    date: { $lt: startDate }
                }
            },
            {
                $group: {
                    _id: "$type",
                    total: { $sum: "$amount" }
                }
            }
        ]);
        let creditBefore = 0, debitBefore = 0;
        priorAgg.forEach(item => {
            if (item._id === "credit") creditBefore = item.total;
            if (item._id === "debit") debitBefore = item.total;
        });
        let currentBalance = openingBalance + creditBefore - debitBefore;

        // 5. Fetch all transactions in this FY (up to effectiveEndDate)
        const transactions = await TransactionModel.find({
            userId: user._id,
            date: { $gte: startDate, $lte: effectiveEndDate }
        })
            .sort({ date: 1 })
            .lean();

        if (!transactions.length) {
            return res.status(200).json([
                {
                    date: normalizeDate(startDate, "dayStart"),
                    balance: parseFloat(currentBalance.toFixed(2))
                }
            ]);
        }

        // 6. Build daily totals
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

        // 7. Loop only until effectiveEndDate
        const series = [];
        const cursorDate = new Date(startDate);
        const endDay = normalizeDate(effectiveEndDate, "dayStart");

        while (cursorDate <= endDay) {
            const dayStr = normalizeDate(cursorDate, "dayStart");
            const totals = dailyTotals[dayStr] || { credit: 0, debit: 0 };
            currentBalance += totals.credit - totals.debit;

            series.push({
                date: dayStr,
                balance: parseFloat(currentBalance.toFixed(2))
            });

            cursorDate.setDate(cursorDate.getDate() + 1);
        }

        return res.status(200).json(series);

    } catch (error) {
        console.error("Error generating daily balance series:", error);
        res.status(500).json({ error: "Server error while generating daily balance series" });
    }
};

// @desc    Get monthly debit/credit totals for a given financial year
// @route   GET /api/dashboard/series/monthlySpending?fy=2023-24
// @access  Private
exports.getMonthlySpendingSeries = async (req, res) => {
    try {
        const userId = req.userId;
        const { fy } = req.query;

        if (!fy || !/^\d{4}-\d{2}$/.test(fy)) {
            return res.status(400).json({ error: "Invalid or missing financial year format. Use YYYY-YY." });
        }

        // Parse FY string into start and end dates
        const [startYearStr, endYearSuffix] = fy.split("-");
        const startYear = parseInt(startYearStr, 10);
        const endYear = parseInt(startYearStr.slice(0, 2) + endYearSuffix, 10);

        const startDate = new Date(startYear, 3, 1);
        const endDate = new Date(endYear, 2, 31, 23, 59, 59, 999);

        // 1. Find user's last transaction date
        const lastTxn = await TransactionModel.findOne({ userId }).sort({ date: -1 }).select("date");
        const lastTxnDate = lastTxn?.date;
        if (!lastTxnDate) return res.status(200).json([]); // no data ever

        const effectiveEndDate = lastTxnDate < endDate ? lastTxnDate : endDate;

        // 2. Aggregate data monthwise for input financial year
        const result = await TransactionModel.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    date: { $gte: startDate, $lte: effectiveEndDate }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" },
                        type: "$type"
                    },
                    total: { $sum: "$amount" }
                }
            }
        ]);

        // 3. Create monthly map for total credit and debit balances
        const monthlyMap = {};
        result.forEach(item => {
            const ym = `${item._id.year}-${String(item._id.month).padStart(2, "0")}`;
            if (!monthlyMap[ym]) {
                monthlyMap[ym] = { credit: 0, debit: 0 };
            }
            monthlyMap[ym][item._id.type] = item.total;
        });

        // 4. Build only up to lastTxn month
        const data = [];
        let current = new Date(startDate);
        while (current <= effectiveEndDate) {
            const ym = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}`;
            const { credit = 0, debit = 0 } = monthlyMap[ym] || {};
            data.push({
                month: current.toLocaleString("default", { month: "short" }),
                year: current.getFullYear(),
                credit: parseFloat(credit.toFixed(2)),
                debit: parseFloat(debit.toFixed(2))
            });
            current.setMonth(current.getMonth() + 1);
        }
        res.status(200).json(data);

    } catch (error) {
        console.error("Error fetching monthly spending chart:", error);
        res.status(500).json({ error: "Server error while fetching monthly spending chart." });
    }
};

// @desc    Get cumulative monthly balance for a given financial year
// @route   GET /api/user/dashboard/series/monthlyBalance?fy=2023-24
// @access  Private
exports.getMonthlyBalanceSeries = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId).select("openingBalance createdAt");
        if (!user) return res.status(404).json({ error: "User not found" });

        const openingBalance = user.openingBalance?.amount || 0;
        const { fy } = req.query;

        if (!fy || !/^\d{4}-\d{2}$/.test(fy)) {
            return res.status(400).json({ error: "Invalid or missing financial year format. Use YYYY-YY." });
        }

        // Parse FY string into start and end dates
        const [startYearStr, endYearSuffix] = fy.split("-");
        const startYear = parseInt(startYearStr, 10);
        const endYear = parseInt(startYearStr.slice(0, 2) + endYearSuffix, 10);

        const startDate = new Date(startYear, 3, 1); // Apr 1
        const endDate = new Date(endYear, 2, 31, 23, 59, 59, 999); // Mar 31

        // 1. Find user's last transaction date
        const lastTxn = await TransactionModel.findOne({ userId: user._id })
            .sort({ date: -1 })
            .select("date");
        const lastTxnDate = lastTxn?.date;
        if (!lastTxnDate) {
            // no transactions ever → return opening balance only
            return res.status(200).json([
                { month: startDate.toLocaleString("default", { month: "short" }), balance: parseFloat(openingBalance.toFixed(2)) }
            ]);
        }

        // 2. Clamp FY end to last transaction date if earlier
        const effectiveEndDate = lastTxnDate < endDate ? lastTxnDate : endDate;

        // 3. Get cumulative balance up to FY start
        const priorAgg = await TransactionModel.aggregate([
            {
                $match: {
                    userId: user._id,
                    date: { $lt: startDate }
                }
            },
            {
                $group: {
                    _id: "$type",
                    total: { $sum: "$amount" }
                }
            }
        ]);
        let creditBefore = 0, debitBefore = 0;
        priorAgg.forEach(item => {
            if (item._id === "credit") creditBefore = item.total;
            if (item._id === "debit") debitBefore = item.total;
        });
        let currentBalance = openingBalance + creditBefore - debitBefore;

        // 4. Aggregate by month for this FY up to effectiveEndDate
        const result = await TransactionModel.aggregate([
            {
                $match: {
                    userId: user._id,
                    date: { $gte: startDate, $lte: effectiveEndDate }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" },
                        type: "$type"
                    },
                    total: { $sum: "$amount" }
                }
            }
        ]);

        // 5. Convert aggregation to a map: { 'YYYY-MM': {credit, debit} }
        const monthlyMap = {};
        result.forEach(item => {
            const ym = `${item._id.year}-${String(item._id.month).padStart(2, "0")}`;
            if (!monthlyMap[ym]) {
                monthlyMap[ym] = { credit: 0, debit: 0 };
            }
            monthlyMap[ym][item._id.type] = item.total;
        });

        // 6. Build cumulative monthly balance series
        const data = [];
        let cursor = new Date(startDate);
        while (cursor <= effectiveEndDate) {
            const ym = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`;
            const { credit = 0, debit = 0 } = monthlyMap[ym] || {};
            currentBalance += credit - debit;
            data.push({
                month: cursor.toLocaleString("default", { month: "short" }),
                year: cursor.getFullYear(),
                balance: parseFloat(currentBalance.toFixed(2))
            });
            cursor.setMonth(cursor.getMonth() + 1);
        }

        res.status(200).json(data);

    } catch (error) {
        console.error("Error generating cumulative monthly balance series:", error);
        res.status(500).json({ error: "Server error while generating cumulative monthly balance series" });
    }
};

