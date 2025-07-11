export function getLocalDateString(date = new Date()) {
    const nativeDate = typeof date?.getFullYear === "function" ? date : new Date(date);
    const year = nativeDate.getFullYear();
    const month = String(nativeDate.getMonth() + 1).padStart(2, "0");
    const day = String(nativeDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export function getToday() {
    const today = new Date();
    return getLocalDateString(today);
}

export function getStartOfMonth() {
    const date = new Date();
    date.setDate(1);
    return getLocalDateString(date);
}

export function getStartOfYear() {
    const date = new Date();
    date.setDate(1);
    date.setMonth(0);
    return getLocalDateString(date);
}

export function getDateBeforeGivenMonths(months = 1) {
    const date = new Date();
    date.setMonth(date.getMonth() - months);
    return getLocalDateString(date);
}

export function getDateBeforeGivenYears(years) {
    const date = new Date();
    date.setFullYear(date.getFullYear() - years);
    return getLocalDateString(date);
}

export function getFinancialYearRange(lastN) {
    const currentDate = new Date();
    const year = currentDate.getMonth() >= 3 ? currentDate.getFullYear() : currentDate.getFullYear() - 1;
    const startYear = year - lastN;
    const from = `${startYear}-04-01`;
    const to = lastN === 0 ? getToday() : `${startYear + 1}-03-31`;
    return {
        label: `FY ${startYear}-${startYear + 1}`,
        from,
        to,
    };
}