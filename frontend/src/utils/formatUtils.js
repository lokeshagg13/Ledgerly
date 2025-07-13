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

export function formatAmountForPreview(amount, maxIntegerDigits) {
    if (amount == null || typeof amount !== "number") return "";

    const fixedAmount = amount.toFixed(2); // ensures 2 decimal places
    const [intPart, decimalPart] = fixedAmount.split(".");
    const formattedInt = parseInt(intPart, 10).toLocaleString("en-IN");
    const paddingNeeded = maxIntegerDigits - formattedInt.length;
    console.log(paddingNeeded)
    const padding = " ".repeat(paddingNeeded > 0 ? paddingNeeded : 0);
    return `${padding}${formattedInt}.${decimalPart}`;
}

export function formatAmountForFirstTimeInput(amount) {
    if (typeof amount === "number") amount = amount.toString();
    if (!amount.includes('.')) {
        const formattedInt = parseInt(amount).toString();
        return `${formattedInt}.00`;
    }
    const [intPart, decimalPartRaw] = amount.split(".");
    const formattedInt = parseInt(intPart).toString();
    let decimalPart = (decimalPartRaw || "").padEnd(2, "0").slice(0, 2);
    return `${formattedInt}.${decimalPart}`;
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

export function formatStringForCenterPadding(str, totalLength = 20) {
  const trimmed = str?.toString().trim() || "";
  const padLength = Math.max(totalLength - trimmed.length, 0);
  const leftPad = Math.floor(padLength / 2);
  const rightPad = padLength - leftPad;
  console.log(str, leftPad, rightPad)
  return " ".repeat(leftPad) + trimmed + " ".repeat(rightPad);
}

export function formatCategoryError(errorMessage) {
    const regex = /transactions:\s*(.*?)\.\s*Please/;
    const match = errorMessage.match(regex);

    if (!match) return <>{errorMessage}</>;

    const before = errorMessage.split(match[0])[0];
    const after = errorMessage.split(match[0])[1];
    const categories = match[1].split(",");

    const categoryItems = categories.slice(0, 4).map((cat, i) => (
        <li key={i} style={{ fontWeight: 600 }}>
            {cat.trim()}
            {i === 3 && categories.length > 4 ? ", etc." : ""}
        </li>
    ));

    return (
        <>
            {before}
            {"transactions: "}
            <ul style={{ marginBottom: 0 }}>
                {categoryItems}
            </ul>
            {"Please"}
            {after}
        </>
    );
}
