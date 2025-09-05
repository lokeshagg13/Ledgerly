const fs = require('fs');
const { PdfReader } = require('pdfreader');
const mongoose = require('mongoose');

const HeadModel = require('../models/Head');

// 1. Expects no header row, 
// 2. Expects no page numbers in PDF
// 3. Expects columns with 
//     3.a. either just "Head" column 
//     3.b. or three columns: "Head", "Opening Balance" and "Balance Type (CR/DR)"
function fetchHeadData(data) {
    const isBalancePattern = data.every((item, index) => {
        if (index % 3 === 1) {
            if (/^[0-9.,]+$/.test(item.trim()) === false) return /^[0-9.,]+$/.test(item.trim());
        }
        return true;
    });

    if (isBalancePattern) {
        const heads = [];
        for (let i = 0; i < data.length; i += 3) {
            heads.push({
                name: data[i].trim(),
                openingBalance: parseFloat(data[i + 1].replace(/,/g, "")) || 0,
                openingBalanceType: data[i + 2]?.trim().toUpperCase() === "DR" ? "debit" : "credit"
            });
        }
        return heads;
    } else {
        return data.map((head) => ({
            name: head.trim(),
            openingBalance: 0,
            openingBalanceType: "credit"
        }));
    }
}

exports.extractHeadsFromPDF = async (req, res) => {
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
        const heads = fetchHeadData(data);
        res.status(200).json({ heads });
    } catch (error) {
        res.status(400).json({ error: "Server Error while extracting data from PDF: " + error.message });
    } finally {
        fs.unlink(pdfPath, () => { });
    }
}

exports.uploadBulkHeads = async (req, res) => {
    const userId = req.userId;
    const heads = req.body.heads;

    if (!Array.isArray(heads) || heads.length === 0) {
        return res.status(400).json({ error: "Heads must be a non-empty array." });
    }

    try {
        const normalizedHeads = [];

        // Step 1: Validate first (no DB writes yet)
        for (let i = 0; i < heads.length; i++) {
            const head = heads[i];
            const headNameTrimmed = head.name?.trim();
            const headActive = head?.active ?? true;
            const indexLabel = `Head #${i + 1}`;

            if (!headNameTrimmed) {
                return res.status(400).json({ error: `${indexLabel}: Head name cannot be empty.` });
            }

            if (headNameTrimmed.length > 50) {
                return res.status(400).json({ error: `${indexLabel}: Head name must not exceed 50 characters.` });
            }

            // Default openingBalance to 0 if not provided or invalid, if negative, then debit and if positive, then credit
            let headOpeningBalance = 0;
            if (head.openingBalance !== undefined && head.openingBalance !== null) {
                const parsedBalance = parseFloat(head.openingBalance);
                if (!isNaN(parsedBalance)) {
                    headOpeningBalance = parsedBalance;
                }
            }

            // Check for duplicates
            const duplicate = await HeadModel.findOne({ userId, name: headNameTrimmed });
            if (duplicate) {
                return res.status(400).json({ error: `${indexLabel}: Duplicate head detected.` });
            }

            normalizedHeads.push({
                userId,
                name: headNameTrimmed,
                active: headActive,
                openingBalance: {
                    amount: headOpeningBalance,
                    lastUpdated: new Date()
                }
            });
        }

        // Step 2: Insert in bulk only if all valid
        await HeadModel.insertMany(normalizedHeads);

        return res.status(201).json({
            message: `${normalizedHeads.length} head(s) added successfully.`,
        });
    } catch (error) {
        return res.status(500).json({
            error: "Server Error while uploading heads: " + error.message,
        });
    }
};
