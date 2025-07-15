const { createCanvas } = require("canvas");
const { formatDateForPrintPreview, formatAmountForTablePrintPreview } = require("./formatters");

const CANVAS_WIDTH = 2200;
const CANVAS_HEIGHT = CANVAS_WIDTH / Math.sqrt(2);
const PAGE_BACKGROUND_COLOR = "#f8f9fa";
const PAGE_HEADER_COLOR = "#343a40";
const SECTION_TITLE_COLOR = "#0d6efd";
const TABLE_HEADER_BG = "#e9ecef";
const TABLE_HEADER_COLOR = "#0B3D91";
const TABLE_THICK_BORDER_COLOR = "#adb5bd";
const TABLE_THIN_BORDER_COLOR = "#dee2e6";
const TABLE_TEXT_COLOR = "#000000";
const LINE_HEIGHT = 50;
const PAGE_FONT = "italic 30px sans-serif";
const USER_FONT = "bold 30px sans-serif";
const TITLE_FONT = "bold 30px sans-serif";
const BODY_FONT = "24px sans-serif";

const COLUMNS = [
    { key: "amount", label: "Amount", width: 270 },
    { key: "category", label: "Category", width: 300 },
    { key: "subcategory", label: "Subcategory", width: 300 },
    { key: "date", label: "Date", width: 180 },
];

function drawTransactionTable(ctx, transactions, x, yStart) {
    ctx.font = BODY_FONT;
    let y = yStart;

    // Table Header Background
    const headerHeight = LINE_HEIGHT;
    const rowHeight = LINE_HEIGHT;
    const tableWidth = COLUMNS.reduce((sum, col) => sum + col.width, 0);

    // Draw header background
    ctx.fillStyle = TABLE_HEADER_BG;
    ctx.fillRect(x, y, tableWidth, headerHeight);

    // Horizontal line above header
    ctx.strokeStyle = TABLE_THICK_BORDER_COLOR;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + tableWidth, y);
    ctx.stroke();

    // Draw header text and borders
    ctx.fillStyle = TABLE_HEADER_COLOR;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    let colX = x;
    COLUMNS.forEach(col => {
        ctx.fillText(col.label, colX + col.width / 2, y + headerHeight / 2);
        colX += col.width;
    });

    // Horizontal line under header
    ctx.strokeStyle = TABLE_THICK_BORDER_COLOR
    ctx.beginPath();
    ctx.moveTo(x, y + headerHeight);
    ctx.lineTo(x + tableWidth, y + headerHeight);
    ctx.stroke();

    y += headerHeight;

    // Draw each row
    transactions.forEach((txn) => {
        const values = {
            amount: formatAmountForTablePrintPreview(txn.amount),
            category: txn.categoryName,
            subcategory: txn.subcategoryName || "",
            date: formatDateForPrintPreview(txn.date),
        };

        // Draw row text
        ctx.fillStyle = TABLE_TEXT_COLOR;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        let valX = x;
        COLUMNS.forEach(col => {
            ctx.fillText(values[col.key], valX + col.width / 2, y + rowHeight / 2);
            valX += col.width;
        });

        // Horizontal row line
        ctx.strokeStyle = TABLE_THIN_BORDER_COLOR;
        ctx.beginPath();
        ctx.moveTo(x, y + rowHeight);
        ctx.lineTo(x + tableWidth, y + rowHeight);
        ctx.stroke();

        y += rowHeight;
    });

    // Draw outer vertical lines
    ctx.strokeStyle = TABLE_THICK_BORDER_COLOR;
    let currentX = x;
    ctx.beginPath();
    for (let col of COLUMNS) {
        ctx.moveTo(currentX, yStart);
        ctx.lineTo(currentX, y);
        currentX += col.width;
    }
    ctx.moveTo(currentX, yStart);
    ctx.lineTo(currentX, y);
    ctx.stroke();

    return y;
}

// Draw section containing a title for the transactions and the transactions in it
function drawTransactionSection(ctx, transactions, sectionTitle, sectionCenterX, sectionX, sectionY) {
    if (transactions.length <= 0) return;
    ctx.font = TITLE_FONT;
    ctx.fillStyle = SECTION_TITLE_COLOR;
    const titleTextWidth = ctx.measureText(sectionTitle).width;
    ctx.fillText(sectionTitle, sectionCenterX - 0.5 * titleTextWidth, sectionY);

    const sectionStartY = 30 + sectionY;
    drawTransactionTable(ctx, transactions, sectionX, sectionStartY);
}

// Draw transaction table page
function drawTransactionPage({ debitTransactions, creditTransactions }, pageNumber, totalPages, userName) {
    const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    const ctx = canvas.getContext("2d");

    // Background
    ctx.fillStyle = PAGE_BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Header
    const paddingTop = 50;
    const paddingLeft = 30;

    ctx.fillStyle = PAGE_HEADER_COLOR;
    ctx.font = PAGE_FONT;
    ctx.fillText(`Page ${pageNumber} / ${totalPages}`, paddingLeft, paddingTop);

    if (userName) {
        const nameText = userName.toUpperCase();
        ctx.font = USER_FONT;
        const nameWidth = ctx.measureText(nameText).width;
        ctx.fillText(nameText, (CANVAS_WIDTH - nameWidth) / 2, paddingTop);
    }

    const sectionSpacing = 20;
    const sectionWidth = 0.5 * (canvas.width - sectionSpacing);
    const leftSectionX = paddingLeft;
    const rightSectionX = paddingLeft + sectionWidth + sectionSpacing;
    const sectionY = 50 + paddingTop;
    const sectionCenter = 0.5 * sectionWidth;
    const debitCenterX = leftSectionX + sectionCenter;
    const creditCenterX = rightSectionX + sectionCenter;

    // Draw rest everything on the page
    const debitTitle = "DR";
    const creditTitle = "CR";
    drawTransactionSection(ctx, debitTransactions, debitTitle, debitCenterX, leftSectionX, sectionY);
    drawTransactionSection(ctx, creditTransactions, creditTitle, creditCenterX, rightSectionX, sectionY);
    return canvas.toBuffer("image/png");
}

// Pagination transactions tables
function paginateTransactions(transactions, rowsPerSection = 25) {
    const pages = [];
    const debitTxns = transactions.filter(t => t.type === "debit");
    const creditTxns = transactions.filter(t => t.type === "credit");

    let debitIndex = 0;
    let creditIndex = 0;

    while (debitIndex < debitTxns.length || creditIndex < creditTxns.length) {
        const page = { debitTransactions: [], creditTransactions: [] };

        page.debitTransactions = debitTxns.slice(debitIndex, debitIndex + rowsPerSection);
        page.creditTransactions = creditTxns.slice(creditIndex, creditIndex + rowsPerSection);

        debitIndex += rowsPerSection;
        creditIndex += rowsPerSection;

        pages.push(page);
    }
    return pages;
}

// Call the paginate function to divide transactions into pages and then draw each page while saving that page's canvas image in buffers
exports.generateTablePreviewImages = (transactions, userName) => {
    const pages = paginateTransactions(transactions);
    const buffers = [];

    pages.forEach((transactions, pageIndex) => {
        const buffer = drawTransactionPage(
            transactions,
            pageIndex + 1,
            pages.length,
            userName
        );
        buffers.push(buffer);
    });
    return buffers;
};




