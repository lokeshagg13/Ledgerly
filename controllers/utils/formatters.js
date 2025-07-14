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

export function formatAmountForCAPrintPreview(amount, maxDigits = 20) {
    if (amount == null || typeof amount !== "number") return "";
    const fixedAmount = amount.toFixed(2);
    const [intPart, decimalPart] = fixedAmount.split(".");
    const formattedInt = parseInt(intPart, 10).toLocaleString("en-IN");
    const paddingNeeded = maxDigits - formattedInt.length;
    const padding = " ".repeat(paddingNeeded > 0 ? paddingNeeded : 0);
    return `${padding}${formattedInt}.${decimalPart}`;
}

export function addPaddingAroundString(str, maxLength = 40) {
    const trimmed = str?.toString().trim() || "";
    if (trimmed.length >= maxLength) return str;
    const totalPadding = Math.max(maxLength - trimmed.length, 0);
    const leftPad = Math.floor(totalPadding / 2);
    const rightPad = totalPadding - leftPad;
    return " ".repeat(leftPad) + trimmed + " ".repeat(rightPad);
}

export function formatDateForCAPrintPreview(dateString, sep = ".") {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${day}${sep}${month}${sep}${year}`;
}





