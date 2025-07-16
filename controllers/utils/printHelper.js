const { createCanvas } = require("canvas");
const {
    formatAmountForCAPrintPreview,
    formatAmountForTablePrintPreview,
    formatDateForPrintPreview,
    addPaddingAroundString
} = require("./formatters");


class TransactionPreviewGenerator {
    static modes = {
        TABLE_SEPARATE: "TABLE_SEPARATE",
        TABLE_COMBINED: "TABLE_COMBINED",
        CA_SEPARATE: "CA_SEPARATE",
        CA_COMBINED: "CA_COMBINED",
    };

    static constants = {
        COLORS: {
            PAGE_BG: "#f8f9fa",
            PAGE_HEADER: "#343a40",
            SECTION_TITLE: "#0d6efd",
            DEBIT_BG: "rgba(255, 0, 0, 0.06)",
            CREDIT_BG: "rgba(0, 255, 0, 0.06)",
            DEBIT_TEXT: "#dc3545",
            CREDIT_TEXT: "#198754",
            TEXT: "#000000",
            TABLE_HEADER_BG: "#e9ecef",
            TABLE_HEADER_TEXT: "#0B3D91",
            TABLE_BORDER_THICK: "#adb5bd",
            TABLE_BORDER_THIN: "#dee2e6",
        },
        DIMENSIONS: {
            LANDSCAPE_WIDTH: 2200,
            LANDSCAPE_HEIGHT: 2200 / Math.sqrt(2),
            PORTRAIT_WIDTH: 1100,
            PORTRAIT_HEIGHT: 1100 * Math.sqrt(2),
            CA_LINE_HEIGHT: 26,
            TABLE_LINE_HEIGHT: 50,
            SECTION_SPACING: 20,
            PAGE_PADDING: {
                TOP: 50,
                LEFT: 30,
                RIGHT: 30
            },
            LINE_BG_PADDING: 4,
            LINE_SPACING: 4
        },
        FONTS: {
            PAGE: "italic 18px sans-serif",
            USER: "bold 18px sans-serif",
            TITLE: "bold 18px sans-serif",
            TEXT: "14px monospace",
            LANDSCAPE_PAGE: "italic 30px sans-serif",
            LANDSCAPE_USER: "bold 30px sans-serif",
            LANDSCAPE_TITLE: "bold 30px sans-serif",
            LANDSCAPE_BODY: "24px sans-serif",
            PORTRAIT_BODY: "18px sans-serif",
        },
        COLUMNS: {
            SEPARATE: [
                { key: "amount", label: "Amount", width: 270 },
                { key: "category", label: "Category", width: 300 },
                { key: "subcategory", label: "Subcategory", width: 300 },
                { key: "date", label: "Date", width: 180 },
            ],
            COMBINED: [
                { key: "type", label: "Type", width: 90 },
                { key: "amount", label: "Amount", width: 240 },
                { key: "category", label: "Category", width: 270 },
                { key: "subcategory", label: "Subcategory", width: 270 },
                { key: "date", label: "Date", width: 150 },
            ],
        }
    };

    constructor(transactions, userName, mode) {
        this.transactions = transactions;
        this.userName = userName;
        this.mode = mode;
        this.isSeparate = mode.includes("SEPARATE");
        this.isTable = mode.includes("TABLE");
        this.isLandscape = mode === TransactionPreviewGenerator.modes.TABLE_SEPARATE;
    }

    #combineCategorySubcategoryNames(c = "", s = "") {
        return `${c}${s ? " (" + s + ")" : ""}`;
    }

    #getMaxDigitsInAmounts(transactions) {
        return Math.max(...transactions.map(t => Math.floor(t.amount).toLocaleString("en-IN").length), 0);
    }

    #getMaxCharactersInCategories(transactions, maxLimit = 20) {
        return 4 + Math.min(
            maxLimit,
            Math.max(...transactions.map(t => this.#combineCategorySubcategoryNames(
                t.categoryName,
                t.subcategoryName
            ).length), 0)
        );
    }

    #drawSectionTitle(ctx, title, x, y) {
        const titleTextWidth = ctx.measureText(title).width;
        ctx.fillText(title, x - titleTextWidth / 2, y);
    }

    #drawSectionTitles(ctx, { debitTransactions, creditTransactions }, leftCenterX, rightCenterX, y) {
        const { FONTS: F, COLORS: C } = TransactionPreviewGenerator.constants;
        ctx.font = this.isLandscape ? F.LANDSCAPE_TITLE : F.TITLE;
        ctx.fillStyle = C.SECTION_TITLE;
        if (debitTransactions.length > 0) {
            this.#drawSectionTitle(ctx, "DR", leftCenterX, y);
        }
        if (creditTransactions.length > 0) {
            this.#drawSectionTitle(ctx, "CR", rightCenterX, y);
        }
    }

    #drawCALinesForSeparateVersion(ctx, transactions, centerX, startY) {
        const { FONTS: F, COLORS: C, DIMENSIONS: D } = TransactionPreviewGenerator.constants;
        const maxDigits = this.#getMaxDigitsInAmounts(transactions);
        const maxCatLen = this.#getMaxCharactersInCategories(transactions, 20);

        const lines = [];
        for (let txn of transactions) {
            const { amount, categoryName, subcategoryName, date } = txn;
            const dateStr = formatDateForPrintPreview(date, ".");
            const amountStr = formatAmountForCAPrintPreview(amount, maxDigits);
            const combined = this.#combineCategorySubcategoryNames(categoryName, subcategoryName);
            if (combined.length > 20) {
                const categoryStr = addPaddingAroundString(categoryName, maxCatLen);
                lines.push(`${amountStr} - ${categoryStr} - ${dateStr}`);
                const subcategoryStr = addPaddingAroundString(`(${subcategoryName})`, maxCatLen);
                lines.push(`${" ".repeat(maxDigits + 6)}${subcategoryStr}`);    // 6 => 1 decimal + 2 decimal places + 1 space + 1 hyphen + 1 space
            } else {
                const combinedStr = addPaddingAroundString(combined, maxCatLen);
                lines.push(`${amountStr} - ${combinedStr} - ${dateStr}`);
            }
        }

        ctx.font = F.TEXT;
        ctx.fillStyle = C.TEXT;
        ctx.textAlign = "left";

        const maxLineWidth = Math.max(...lines.map((line) => ctx.measureText(line).width));
        const startX = centerX - 0.5 * maxLineWidth;
        let y = startY;
        lines.forEach((line) => {
            ctx.fillText(line, startX, y);
            y += D.CA_LINE_HEIGHT;
        });
    }

    #drawCALinesForCombinedVersion(ctx, transactions, centerX, startY) {
        const { FONTS: F, COLORS: C, DIMENSIONS: D } = TransactionPreviewGenerator.constants;
        const maxDigits = this.#getMaxDigitsInAmounts(transactions) + 2;
        const maxCatLen = this.#getMaxCharactersInCategories(transactions, 40);

        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.font = F.TEXT;

        let y = startY;
        const bgPadding = D.LINE_BG_PADDING;
        const lineHeight = D.CA_LINE_HEIGHT;
        const lineBoxHeight = lineHeight + 2 * bgPadding;
        const lineSpacing = D.LINE_SPACING;

        for (const txn of transactions) {
            const { type, amount, categoryName, subcategoryName, date } = txn;
            const typeToDisplay = type === "debit" ? "DR" : "CR";
            const dateStr = formatDateForPrintPreview(date, ".");
            const combined = this.#combineCategorySubcategoryNames(categoryName, subcategoryName);
            const combinedStr = addPaddingAroundString(combined, maxCatLen);
            const amountStr = formatAmountForCAPrintPreview(amount, maxDigits, type === "debit" ? "-" : "+");
            const amountText = `${amountStr} (${typeToDisplay})`;
            const restText = ` - ${combinedStr} - ${dateStr}`;
            const fullLineWidth = ctx.measureText(amountText + restText).width;
            const startX = centerX - 0.5 * fullLineWidth;
            const textY = y + bgPadding + 0.5 * lineHeight;

            // Draw line background
            ctx.fillStyle = type === "debit" ? C.DEBIT_BG : C.CREDIT_BG;
            ctx.fillRect(startX - bgPadding, y, fullLineWidth + 2 * bgPadding, lineBoxHeight);

            // Draw colored amount
            ctx.fillStyle = type === "debit" ? C.DEBIT_TEXT : C.CREDIT_TEXT;
            ctx.fillText(amountText, startX, textY);

            // Draw rest of text
            const amountWidth = ctx.measureText(amountText).width;
            ctx.fillStyle = C.TEXT;
            ctx.fillText(restText, startX + amountWidth, textY);

            y += lineBoxHeight + lineSpacing;
        }
    }

    #drawTable(ctx, transactions, centerX, startY) {
        const { COLORS: C, FONTS: F, DIMENSIONS: D, COLUMNS } = TransactionPreviewGenerator.constants;

        const columns = this.isSeparate ? COLUMNS.SEPARATE : COLUMNS.COMBINED;
        const headerHeight = this.isSeparate ? D.TABLE_LINE_HEIGHT : D.TABLE_LINE_HEIGHT + 5;
        const rowHeight = D.TABLE_LINE_HEIGHT;
        const tableWidth = columns.reduce((acc, col) => acc + col.width, 0);
        let x = centerX - tableWidth / 2;
        let y = startY;

        // Header
        ctx.fillStyle = C.TABLE_HEADER_BG;
        ctx.fillRect(x, y, tableWidth, headerHeight);

        // Horizontal line above header
        ctx.strokeStyle = C.TABLE_BORDER_THICK;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + tableWidth, y);
        ctx.stroke();

        // Header text
        ctx.font = this.isLandscape ? F.LANDSCAPE_BODY : F.PORTRAIT_BODY;
        ctx.fillStyle = C.TABLE_HEADER_TEXT;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        let colX = x;
        for (let col of columns) {
            ctx.fillText(col.label, colX + col.width / 2, y + headerHeight / 2);
            colX += col.width;
        }

        // Horizontal line under header
        ctx.strokeStyle = C.TABLE_BORDER_THICK;
        ctx.beginPath();
        ctx.moveTo(x, y + headerHeight);
        ctx.lineTo(x + tableWidth, y + headerHeight);
        ctx.stroke();

        y += headerHeight;

        for (let txn of transactions) {
            const values = {
                type: txn.type === "debit" ? "DR" : "CR",
                amount: formatAmountForTablePrintPreview(txn.amount),
                category: txn.categoryName,
                subcategory: txn.subcategoryName || "",
                date: formatDateForPrintPreview(txn.date),
            };

            // Add row background color
            if (!this.isSeparate) {
                ctx.fillStyle = txn.type === "debit" ? C.DEBIT_BG : C.CREDIT_BG;
                ctx.fillRect(x, y, tableWidth, rowHeight);
            }

            ctx.fillStyle = C.TEXT;
            let valueX = x;
            for (let col of columns) {
                ctx.fillText(values[col.key], valueX + col.width / 2, y + rowHeight / 2);
                valueX += col.width;
            }

            // Horizontal row line
            ctx.strokeStyle = C.TABLE_BORDER_THIN;
            ctx.beginPath();
            ctx.moveTo(x, y + rowHeight);
            ctx.lineTo(x + tableWidth, y + rowHeight);
            ctx.stroke();

            y += rowHeight;
        }

        // Draw outer vertical lines
        ctx.strokeStyle = C.TABLE_BORDER_THICK;
        let currentX = x;
        ctx.beginPath();
        for (let col of columns) {
            ctx.moveTo(currentX, startY);
            ctx.lineTo(currentX, y);
            currentX += col.width;
        }
        ctx.moveTo(currentX, startY);
        ctx.lineTo(currentX, y);
        ctx.stroke();

        // Draw table bottomost line
        ctx.strokeStyle = C.TABLE_BORDER_THICK;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + tableWidth, y);
        ctx.stroke();
    }

    #drawPage(pageData, pageNumber, totalPages) {
        const { isSeparate, isTable, isLandscape } = this;
        const { DIMENSIONS: D, COLORS: C, FONTS: F } = TransactionPreviewGenerator.constants;

        const canvasWidth = isLandscape ? D.LANDSCAPE_WIDTH : D.PORTRAIT_WIDTH;
        const canvasHeight = isLandscape ? D.LANDSCAPE_HEIGHT : D.PORTRAIT_HEIGHT;

        const canvas = createCanvas(canvasWidth, canvasHeight);
        const ctx = canvas.getContext("2d");

        // Fill background
        ctx.fillStyle = C.PAGE_BG;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Page padding
        const { TOP: paddingTop, LEFT: paddingLeft, RIGHT: paddingRight } = D.PAGE_PADDING

        // Header: Page number and username
        const pageFont = isLandscape ? F.LANDSCAPE_PAGE : F.PAGE;
        const userFont = isLandscape ? F.LANDSCAPE_USER : F.USER;

        // Draw page number on top-left of the page
        ctx.fillStyle = C.PAGE_HEADER;
        ctx.font = pageFont;
        ctx.fillText(`Page ${pageNumber} / ${totalPages}`, paddingLeft, paddingTop);

        if (this.userName) {
            // Draw user name on top-center of the page
            ctx.font = userFont;
            const text = this.userName.toUpperCase();
            const width = ctx.measureText(text).width;
            ctx.fillText(text, (canvasWidth - width) / 2, paddingTop);
        }

        const pageWidth = (canvasWidth - paddingLeft - paddingRight);
        const pageY = paddingTop + 50;

        if (isSeparate) {
            const { SECTION_SPACING } = D;
            const sectionWidth = (pageWidth - SECTION_SPACING) / 2;
            const leftSectionX = paddingLeft;
            const rightSectionX = paddingLeft + sectionWidth + SECTION_SPACING;
            const leftCenterX = leftSectionX + sectionWidth / 2;
            const rightCenterX = rightSectionX + sectionWidth / 2;

            // Draw section headers
            this.#drawSectionTitles(ctx, pageData, leftCenterX, rightCenterX, pageY);
            const { debitTransactions, creditTransactions } = pageData
            if (isTable) {
                if (debitTransactions.length > 0)
                    this.#drawTable(ctx, debitTransactions, leftCenterX, pageY + 30);
                if (creditTransactions.length > 0)
                    this.#drawTable(ctx, creditTransactions, rightCenterX, pageY + 30);
            } else {
                if (debitTransactions.length > 0)
                    this.#drawCALinesForSeparateVersion(ctx, debitTransactions, leftCenterX, pageY + 30);
                if (creditTransactions.length > 0)
                    this.#drawCALinesForSeparateVersion(ctx, creditTransactions, rightCenterX, pageY + 30);
            }
        } else {
            const pageCenter = paddingLeft + pageWidth / 2;
            const { transactions } = pageData
            if (isTable) {
                this.#drawTable(ctx, transactions, pageCenter, pageY);
            } else {
                this.#drawCALinesForCombinedVersion(ctx, transactions, pageCenter, pageY);
            }
        }
        return canvas.toBuffer("image/png");
    }

    #paginate() {
        const { isSeparate, isTable } = this;
        const rowsPerPage = !isTable
            ? isSeparate ? 52 : 36
            : 25;
        const pages = [];

        if (isSeparate) {
            let dIdx = 0, cIdx = 0;
            const debitTxns = this.transactions.filter(t => t.type === "debit");
            const creditTxns = this.transactions.filter(t => t.type === "credit");

            while (dIdx < debitTxns.length || cIdx < creditTxns.length) {
                const page = { debitTransactions: [], creditTransactions: [] };
                let dLineCount = 0;
                let cLineCount = 0;

                // Fill debit section up to rowsPerPage
                while (dIdx < debitTxns.length) {
                    const txn = debitTxns[dIdx];
                    let lineCost = 1;
                    if (!isTable) {
                        const catStr = this.#combineCategorySubcategoryNames(txn.categoryName, txn.subcategoryName);
                        lineCost = catStr.length > 20 ? 2 : 1;
                    }
                    if (dLineCount + lineCost > rowsPerPage) break;
                    page.debitTransactions.push(txn);
                    dLineCount += lineCost;
                    dIdx += 1;
                }

                // Fill credit section up to rowsPerPage
                while (cIdx < creditTxns.length) {
                    const txn = creditTxns[cIdx];
                    let lineCost = 1;
                    if (!isTable) {
                        const catStr = this.#combineCategorySubcategoryNames(txn.categoryName, txn.subcategoryName);
                        lineCost = catStr.length > 20 ? 2 : 1;
                    }
                    if (cLineCount + lineCost > rowsPerPage) break;
                    page.creditTransactions.push(txn);
                    cLineCount += lineCost;
                    cIdx += 1
                }
                pages.push(page);
            }
        } else {
            let idx = 0;
            while (idx < this.transactions.length) {
                const page = {
                    transactions: this.transactions.slice(idx, idx + rowsPerPage),
                };
                idx += rowsPerPage;
                pages.push(page);
            }
        }
        return pages;
    }

    generateImages() {
        const buffers = [];
        const pages = this.#paginate();

        pages.forEach((pageData, index) => {
            const buffer = this.#drawPage(pageData, index + 1, pages.length);
            buffers.push(buffer);
        });

        return buffers;
    }
}


exports.generateCAPreviewImages = (transactions, userName, keepCreditDebitTxnSeparate) => {
    const { CA_SEPARATE, CA_COMBINED } = TransactionPreviewGenerator.modes;
    const mode = keepCreditDebitTxnSeparate
        ? CA_SEPARATE
        : CA_COMBINED;
    return new TransactionPreviewGenerator(transactions, userName, mode).generateImages();
};

exports.generateTablePreviewImages = (transactions, userName, keepCreditDebitTxnSeparate) => {
    const { TABLE_SEPARATE, TABLE_COMBINED } = TransactionPreviewGenerator.modes;
    const mode = keepCreditDebitTxnSeparate
        ? TABLE_SEPARATE
        : TABLE_COMBINED;
    return new TransactionPreviewGenerator(transactions, userName, mode).generateImages();
};
