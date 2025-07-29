const fs = require('fs');
const { PdfReader } = require('pdfreader');

function fetchTransactionData(data) {
    const dataStr = data.join(' ');
    let counter = 1;
    const transactions = [];
    while (true) {
        const regex = new RegExp(`\\s+${counter}\\s+(\\d{2}/\\d{2}/\\d{4})\\s+(\\d{2}/\\d{2}/\\d{4})\\s+((?:.|\\s)*?)\\s+(\\d+[.]\\d{1,2})\\s+(\\d+[.]\\d{1,2})\\s+(\\d+[.]\\d{1,2})`, 'gm');
        const match = regex.exec(dataStr);
        if (!match) break;

        const date = match[2];
        const remarks = match[3].trim().replace(/\n+/g, ' ');
        const type = parseFloat(match[4]) === 0 ? "credit" : "debit";
        const amount = type === "debit" ? parseFloat(match[4]) : parseFloat(match[5]);
        const balance = parseFloat(match[6]);
        if (transactions.length > 0) {
            const prevBalance = transactions[transactions.length - 1].balance;
            const expectedBalance = parseFloat((prevBalance + (type === "debit" ? -1 : 1) * amount).toFixed(2));
            if (expectedBalance !== balance) {
                throw new Error(`Balance mismatch in transaction ${counter}. Expected: ${expectedBalance}, Found: ${balance}`);
            }
        }

        transactions.push({ date, type, amount, remarks, balance });
        counter += 1;
    }
    return transactions;
}

exports.extractTransactionsFromPDF = async (req, res) => {
    const pdfPath = req.file.path;
    const data = [];

    try {
        await new Promise((resolve, reject) => {
            new PdfReader().parseFileItems(pdfPath, (err, item) => {
                if (err) return reject(err);
                if (!item) return resolve();
                if (item.text) data.push(item.text);
            });
        });

        const transactions = fetchTransactionData(data);
        res.status(200).json({ transactions });
    } catch (error) {
        res.status(400).json({ error: error.message });
    } finally {
        fs.unlink(pdfPath, () => { });
    }
}