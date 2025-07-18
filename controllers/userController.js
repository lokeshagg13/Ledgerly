const bcrypt = require("bcryptjs");
const UserModel = require("../models/User");

// Helper: Email validator
const isValidEmail = (email) => /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/gm.test(email);

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: "Name, email and password are required." });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({ error: "Invalid email." });
        }

        const existing = await UserModel.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(400).json({ error: "Email already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new UserModel({
            name,
            email: email.toLowerCase().trim(),
            password: hashedPassword
        });

        await user.save();
        res.status(201).json(user);

    } catch (error) {
        res.status(500).json({ error: "Error registering user: " + error.message });
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, openingBalance } = req.body;

        if (typeof name === "undefined" && typeof openingBalance === "undefined") {
            return res.status(400).json({ error: "At least one of name or opening balance must be provided." });
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        if (typeof name !== "undefined") {
            const trimmedName = name.trim();
            if (trimmedName.length === 0 || trimmedName.length > 30 || /[^a-zA-Z ]/.test(trimmedName)) {
                return res.status(400).json({ error: "Invalid name format." });
            }
            user.name = trimmedName;
        }

        if (typeof openingBalance !== "undefined") {
            const numericBalance = parseFloat(openingBalance);
            if (isNaN(numericBalance) || numericBalance < Number.MIN_SAFE_INTEGER || numericBalance > Number.MAX_SAFE_INTEGER) {
                return res.status(400).json({ error: "Invalid opening balance value." });
            }
            const now = new Date();
            user.openingBalance = {
                amount: numericBalance,
                lastUpdated: now
            };
        }

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully.",
            updated: {
                name: user.name,
                openingBalance: user.openingBalance
            },
        });
    } catch (error) {
        res.status(500).json({ error: "Error updating profile: " + error.message });
    }
};

