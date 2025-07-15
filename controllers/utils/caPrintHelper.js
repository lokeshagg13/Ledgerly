const { createCanvas } = require("canvas");
const { formatAmountForCAPrintPreview, formatDateForPrintPreview, addPaddingAroundString } = require("./formatters");

const CANVAS_WIDTH = 1100;
const CANVAS_HEIGHT = 1556;
const PAGE_BACKGROUND_COLOR = "#f8f9fa";
const PAGE_HEADER_COLOR = "#343a40";
const SECTION_TITLE_COLOR = "#0d6efd";
const TEXT_COLOR = "#000000";
const LINE_HEIGHT = 26;
const PAGE_FONT = "italic 18px sans-serif";
const USER_FONT = "bold 18px sans-serif";
const TITLE_FONT = "bold 18px sans-serif";
const TEXT_FONT = "14px monospace";

// Combine category and subcategory name into a single string
function combineCategorySubcategoryNames(categoryName = "", subcategoryName = "") {
    return `${categoryName}${subcategoryName
        ? " (" + subcategoryName + ")"
        : ""
        }`;
}

// Get length of longest digit out of all given transactions
function getMaxDigitsInAmount(transactions) {
    return Math.max(
        ...transactions.map((txn) => {
            const intPart = Math.floor(txn.amount).toLocaleString("en-IN");
            return intPart.length;
        }),
        0
    );
}

// Get length of the longest combined name of a transaction's category & subcategory name
function getMaxCharactersInCatString(transactions) {
    return 4 + Math.min(Math.max(
        ...transactions.map((txn) => {
            const str = combineCategorySubcategoryNames(
                txn.categoryName,
                txn.subcategoryName
            );
            return str.length;
        }),
        0
    ), 20);
}

// Draw transactions on given section centered on its section center
function drawTransactionLines(ctx, transactions, centerX, startY) {
    const maxDigitsInAmounts = getMaxDigitsInAmount(transactions);
    const maxCharactersInCatString = getMaxCharactersInCatString(transactions);

    ctx.textAlign = "left";
    ctx.font = TEXT_FONT;
    ctx.fillStyle = TEXT_COLOR;

    const lines = [];
    for (let i = 0; i < transactions.length; i++) {
        const { amount, categoryName, subcategoryName, date } = transactions[i];
        const formattedAmount = formatAmountForCAPrintPreview(amount, maxDigitsInAmounts);
        const formattedDate = formatDateForPrintPreview(date, ".");

        const combinedName = combineCategorySubcategoryNames(categoryName, subcategoryName);
        if (combinedName.length > 20) {
            const formattedCategoryName = addPaddingAroundString(categoryName, maxCharactersInCatString);
            lines.push(`${formattedAmount} - ${formattedCategoryName} - ${formattedDate}`);
            const formattedSubcategoryName = addPaddingAroundString(`(${subcategoryName})`, maxCharactersInCatString);
            lines.push(`${" ".repeat(maxDigitsInAmounts + 6)}${formattedSubcategoryName}`);
            // 6 => 1 decimal + 2 decimal places + 1 space + 1 hyphen + 1 space
        } else {
            const formattedCombinedName = addPaddingAroundString(combinedName, maxCharactersInCatString);
            lines.push(`${formattedAmount} - ${formattedCombinedName} - ${formattedDate}`);
        }
    }

    const maxLineWidth = Math.max(...lines.map((line) => ctx.measureText(line).width));
    const sectionStartX = centerX - 0.5 * maxLineWidth;
    let y = startY;
    lines.forEach((line) => {
        ctx.fillText(line, sectionStartX, y);
        y += LINE_HEIGHT;
    });
}

// Draw section containing a title for the transactions and the transactions in it
function drawTransactionSection(ctx, transactions, sectionTitle, sectionCenterX, sectionY) {
    if (transactions.length <= 0) return;
    ctx.font = TITLE_FONT;
    ctx.fillStyle = SECTION_TITLE_COLOR;
    const titleTextWidth = ctx.measureText(sectionTitle).width;
    ctx.fillText(sectionTitle, sectionCenterX - 0.5 * titleTextWidth, sectionY);

    const sectionStartY = 30 + sectionY;
    drawTransactionLines(ctx, transactions, sectionCenterX, sectionStartY);
}

// Draw entire page of transactions with debit and credit sections
function drawTransactionPage({ debitTransactions, creditTransactions }, pageNumber = 1, totalPages = 10, userName = null) {
    const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    const ctx = canvas.getContext("2d");

    // Creating a page
    ctx.fillStyle = PAGE_BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Page constants
    let paddingTop = 30;
    let paddingLeft = 30;

    // Draw page number on top-left of the page
    ctx.fillStyle = PAGE_HEADER_COLOR;
    ctx.font = PAGE_FONT;
    ctx.fillText(`Page ${pageNumber} / ${totalPages}`, paddingLeft, paddingTop);

    if (userName) {
        // Draw user name on top-center of the page
        ctx.font = USER_FONT;
        const nameWidth = ctx.measureText(userName).width;
        userName = userName.toUpperCase();
        ctx.fillText(userName, (CANVAS_WIDTH - nameWidth) / 2, paddingTop);
    }

    // Section constants
    const sectionSpacing = 20;
    const sectionWidth = 0.5 * (canvas.width - sectionSpacing);
    const leftSectionX = 0;
    const rightSectionX = sectionWidth + sectionSpacing;
    const sectionY = 50 + paddingTop;
    const sectionCenter = 0.5 * sectionWidth;
    const debitCenterX = leftSectionX + sectionCenter;
    const creditCenterX = rightSectionX + sectionCenter;

    // Draw rest everything on the page
    const debitTitle = "DR";
    const creditTitle = "CR";
    drawTransactionSection(ctx, debitTransactions, debitTitle, debitCenterX, sectionY);
    drawTransactionSection(ctx, creditTransactions, creditTitle, creditCenterX, sectionY);
    return canvas.toBuffer("image/png");
}

// Paginate transactions
function paginateTransactions(transactions, linesPerSection = 56) {
    const pages = [];
    let debitLineCount = 0;
    let creditLineCount = 0;

    // Separate debit and credit transactions first
    const debitTxns = transactions.filter(t => t.type === "debit");
    const creditTxns = transactions.filter(t => t.type === "credit");
    let debitIndex = 0;
    let creditIndex = 0;

    while (debitIndex < debitTxns.length || creditIndex < creditTxns.length) {
        // Start a new page
        const page = { debitTransactions: [], creditTransactions: [] };
        debitLineCount = 0;
        creditLineCount = 0;

        // Fill debit section up to linesPerSection
        while (debitIndex < debitTxns.length) {
            const txn = debitTxns[debitIndex];
            const catStr = combineCategorySubcategoryNames(txn.categoryName, txn.subcategoryName);
            const lineCost = catStr.length > 20 ? 2 : 1;

            if (debitLineCount + lineCost > linesPerSection) break;

            page.debitTransactions.push(txn);
            debitLineCount += lineCost;
            debitIndex++;
        }

        // Fill credit section up to linesPerSection
        while (creditIndex < creditTxns.length) {
            const txn = creditTxns[creditIndex];
            const catStr = combineCategorySubcategoryNames(txn.categoryName, txn.subcategoryName);
            const lineCost = catStr.length > 20 ? 2 : 1;

            if (creditLineCount + lineCost > linesPerSection) break;

            page.creditTransactions.push(txn);
            creditLineCount += lineCost;
            creditIndex++;
        }
        pages.push(page);
    }
    return pages;
}

// Call the paginate function to divide transactions into pages and then draw each page while saving that page's canvas image in buffers
exports.generateCAPreviewImages = (transactions, userName) => {
    const linesPerPage = 56;
    const pages = paginateTransactions(transactions, linesPerPage);
    const buffers = [];

    pages.forEach(({ debitTransactions, creditTransactions }, pageIndex) => {
        const buffer = drawTransactionPage({ debitTransactions, creditTransactions }, pageIndex + 1, pages.length, userName);
        buffers.push(buffer);
    });
    return buffers;
};




