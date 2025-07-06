export function formatAmountWithCommas(amount) {
    if (!amount) return "";
    if (amount.includes('.')) {
        const [intPart, decimalPart] = amount.toString().split(".");
        const formattedInt = parseInt(intPart).toLocaleString("en-IN");
        return `${formattedInt}.${decimalPart || ""}`;
    } else {
        return parseInt(amount).toLocaleString("en-IN");
    }
}