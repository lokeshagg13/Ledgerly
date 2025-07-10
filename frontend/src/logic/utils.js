export function formatAmountWithCommas(amount) {
    if (!amount) return "";
    if (typeof amount === "number") amount = amount.toString();
    if (amount.includes('.')) {
        const [intPart, decimalPart] = amount.toString().split(".");
        const formattedInt = parseInt(intPart).toLocaleString("en-IN");
        return `${formattedInt}.${decimalPart || ""}`;
    } else {
        return parseInt(amount).toLocaleString("en-IN");
    }
}

export function formatAmountForDisplay(amount) {
    if (!amount || typeof amount !== "number") return "";
    const [intPart, decimalPart] = amount.toString().split(".");
    const formattedInt = parseInt(intPart).toLocaleString("en-IN");
    return `₹ ${formattedInt}.${decimalPart ? decimalPart.padEnd(2, "0") : "00"}`;
}

export function formatDateForCalendarInput(dateString, sep = '-') {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${year}${sep}${month}${sep}${day}`;
}

export function formatDateForDisplay(dateString) {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
}