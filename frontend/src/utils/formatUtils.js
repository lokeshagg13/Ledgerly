export function formatAmountWithCommas(amount) {
    if (amount == null || Number.isNaN(amount)) return "";
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
    if (amount == null || Number.isNaN(amount)) return "";
    if (typeof amount === "number") amount = amount.toString();
    const [intPart, decimalPart] = amount.split(".");
    const formattedInt = parseInt(intPart).toLocaleString("en-IN");
    return `₹ ${formattedInt}.${decimalPart ? decimalPart.padEnd(2, "0") : "00"}`;
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

export function formatCustomDateFormatForCalendarInput(dateString, inputFormat = "dd/mm/yyyy") {
    if (!dateString || !inputFormat) return "";
    const sepMatch = inputFormat.match(/[^a-zA-Z0-9]/);
    const sep = sepMatch ? sepMatch[0] : "/";
    const formatParts = inputFormat.split(sep).map(part => part.toLowerCase());
    const dateParts = dateString.split(sep);
    if (formatParts.length !== 3 || dateParts.length !== 3) return "";
    const dateMap = {};
    formatParts.forEach((part, index) => {
        dateMap[part] = dateParts[index];
    });
    const year = dateMap["yyyy"];
    const month = dateMap["mm"]?.padStart(2, "0");
    const day = dateMap["dd"]?.padStart(2, "0");
    if (!year || !month || !day) return "";
    return `${year}-${month}-${day}`;
}

export function formatDateForCalendarInput(dateString, sep = '-') {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${year}${sep}${month}${sep}${day}`;
}

export function formatDateForDisplay(dateString, sep = "-", toLocal = false) {
    const date = new Date(dateString);
    const day = String(toLocal ? date.getDate() : date.getUTCDate()).padStart(2, "0");
    const month = String(toLocal ? date.getMonth() + 1 : date.getUTCMonth() + 1).padStart(2, "0");
    const year = toLocal ? date.getFullYear() : date.getUTCFullYear();
    return `${day}${sep}${month}${sep}${year}`;
}

export function formatDateForFancyDisplay(dateString, fullMonthName = false, toLocal = false) {
    const date = new Date(dateString);
    const day = String(toLocal ? date.getDate() : date.getUTCDate()).padStart(2, "0");
    const year = toLocal ? date.getFullYear() : date.getUTCFullYear();
    const month = date.toLocaleString("default", {
        month: fullMonthName ? "long" : "short",
        timeZone: toLocal ? undefined : "UTC" // force UTC if not local
    });
    return `${day} ${month} ${year}`;
}

export function formatCategoryNamesUsingCategoryIds(categoryData, categoryIds) {
    if (!Array.isArray(categoryData) || !Array.isArray(categoryIds)) return "None selected";
    const idToNameMap = new Map(categoryData.map(cat => [cat._id, cat.name]));
    const categoryNames = categoryIds
        .map(id => idToNameMap.get(id))
        .filter(Boolean);
    if (categoryNames.length > 3) {
        return categoryNames.slice(0, 3).join(', ').concat(", etc.");
    }
    return categoryNames.join(', ');
}

export function truncateWithEllipsis(str, maxLength = 20) {
    const dotIndex = str.lastIndexOf(".");
    if (dotIndex === -1)
        return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;

    if (str.length <= maxLength) return str;
    const name = str.slice(0, dotIndex);
    const ext = str.slice(dotIndex);
    const allowedNameLength = maxLength - ext.length - 3;
    return name.slice(0, allowedNameLength) + "..." + ext;
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
