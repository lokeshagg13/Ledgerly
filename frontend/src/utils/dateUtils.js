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

export function getYesterday() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return getLocalDateString(yesterday);
}

export function getStartOfMonth() {
    const date = new Date();
    date.setDate(1);
    return getLocalDateString(date);
}

export function getEndOfLastMonth() {
    const date = new Date();
    date.setDate(0);
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

export function getEndDateOfFinancialYear(lastN) {
    const currentDate = new Date();
    const year = currentDate.getMonth() >= 3 ? currentDate.getFullYear() : currentDate.getFullYear() - 1;
    const startYear = year - lastN;
    const date = `${startYear + 1}-03-31`;
    return {
        label: `End of FY ${startYear}-${startYear + 1}`,
        date
    };
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

export function normalizeDateQuery(input) {
    if (!input || !input.trim()) return null;

    const cleaned = input.toLowerCase().replace(/[^a-z0-9]/gi, "");

    const monthMap = {
        jan: 0, january: 0,
        feb: 1, february: 1,
        mar: 2, march: 2,
        apr: 3, april: 3,
        may: 4,
        jun: 5, june: 5,
        jul: 6, july: 6,
        aug: 7, august: 7,
        sep: 8, sept: 8, september: 8,
        oct: 9, october: 9,
        nov: 10, november: 10,
        dec: 11, december: 11,
    };

    // Helper: Find months by prefix
    const findMonthsByPrefix = (str) => {
        if (!str) return [];
        const matches = Object.keys(monthMap).filter(m => m.startsWith(str));
        return matches ? [...new Set(matches.map((m) => monthMap[m]))] : [];
    };

    let year, months, day;

    // CASE 1: Contains letters → assume year+month+day
    const letterMatch = cleaned.match(/[a-z]+/);
    if (letterMatch) {
        const letters = letterMatch[0];
        months = findMonthsByPrefix(letters);  // fuzzy month match

        const parts = cleaned.split(letters);
        if (parts[0]) {
            year = parseInt(parts[0], 10);
            if (year < 100 && !isNaN(year)) year += 2000;
        }
        if (parts[1]) {
            day = parseInt(parts[1], 10);
        }
    }
    // CASE 2: Only digits → treat as prefix of YYYY, or YYYYMMDD
    else if (/^\d+$/.test(cleaned)) {
        if (cleaned.length === 7 || cleaned.length === 8) {
            year = parseInt(cleaned.slice(0, 4), 10);
            months = parseInt(cleaned.slice(4, 6), 10) - 1;
            day = parseInt(cleaned.slice(6), 10);
        }
        else if (cleaned.length === 5 || cleaned.length === 6) {
            const maybeYear = parseInt(cleaned.slice(0, 4), 10);
            if (maybeYear > 1900) {
                year = maybeYear;
                months = parseInt(cleaned.slice(4), 10) - 1;
            } else {
                year = parseInt(cleaned.slice(0, 2), 10) + 2000;
                months = parseInt(cleaned.slice(2, 4), 10) - 1;
                day = parseInt(cleaned.slice(4), 10);
            }
        }
        else if (cleaned.length === 4) {
            year = parseInt(cleaned, 10);
        }
        else if (cleaned.length >= 1 && cleaned.length <= 3) {
            // partial year (like "2" or "20" or "202")
            year = cleaned;
        }
    }

    const result = {};
    if (year !== undefined) result.year = year;
    if (months !== undefined && months.every(m => m >= 0 && m <= 11)) result.months = months;
    if (day && day >= 1 && day <= 31) result.day = day;
    return Object.keys(result).length ? result : null;
}
