export function formatTransactions(transactions) {
    return transactions.map((txn) => ({
        _id: txn._id,
        amount: txn.amount,
        type: txn.type,
        date: txn.date,
        remarks: txn.remarks,
        categoryId: txn.categoryId?._id || null,
        subcategoryId: txn.subcategoryId?._id || null,
        categoryName: txn.categoryId?.name || null,
        subcategoryName: txn.subcategoryId?.name || null,
    }));
}

export function normalizeDate(date, mode = "dayBegin") {
    const [year, month, day] = new Date(date).toISOString().split("T")[0].split("-");
    const dayBeginDate = new Date(Date.UTC(year, month - 1, day));
    if (mode === "dayEnd") return new Date(dayBeginDate.getTime() + 24 * 60 * 60 * 1000);
    return dayBeginDate;
}

