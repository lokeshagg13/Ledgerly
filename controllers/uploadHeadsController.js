const fs = require('fs');
const { PdfReader } = require('pdfreader');
const mongoose = require('mongoose');

const HeadModel = require('../models/Head');

function fetchHeadData(data) {
    const heads = data.filter(item => /[^0-9]/.test(item));
    return heads;
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
        res.status(400).json({ error: error.message });
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

            const duplicate = await HeadModel.findOne({ userId, name: headNameTrimmed });
            if (duplicate) {
                return res.status(400).json({ error: `${indexLabel}: Duplicate head detected.` });
            }

            normalizedHeads.push({
                userId,
                name: headNameTrimmed,
                active: headActive
            });
        }

        // Step 2: Insert in bulk only if all valid
        await HeadModel.insertMany(normalizedHeads);

        return res.status(201).json({
            message: `${normalizedHeads.length} head(s) added successfully.`,
        });
    } catch (error) {
        return res.status(500).json({
            error: "Failed to upload heads: " + error.message,
        });
    }
};
