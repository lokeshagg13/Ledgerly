const bcrypt = require("bcryptjs");
const UserModel = require("../models/User");

// Helper: Email validator
const isValidEmail = (email) => /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/gm.test(email);

// Check password complexity
const validatePassword = (pwd) => {
    if (pwd.trim() === "") return "Password cannot be just spaces.";
    if (pwd.length < 8 || pwd.length > 32)
        return "Password must be between 8 to 32 characters.";
    if (!/[a-z]/.test(pwd))
        return "Password must have at least one lowercase letter (a–z).";
    if (!/[A-Z]/.test(pwd))
        return "Password must have at least one uppercase letter (A–Z).";
    if (!/\d/.test(pwd)) return "Include at least one number (0–9).";
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd))
        return "Password must have at least one special character.";
    return null;
};

exports.registerUser = async (req, res) => {
    try {
        const { name, type, email, password } = req.body;

        if (!name || !type || !email || !password) {
            return res.status(400).json({ error: "Name, type, email and password are required." });
        }

        if (!["individual", "firm"].includes(type)) {
            return res.status(400).json({ error: "Invalid user type." });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({ error: "Invalid email." });
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            return res.status(400).json({ error: passwordError });
        }

        const existing = await UserModel.findOne({ email: email.toLowerCase(), type: type });
        if (existing) {
            return res.status(400).json({ error: "Email already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new UserModel({
            name,
            type,
            email: email.toLowerCase().trim(),
            password: hashedPassword
        });

        await user.save();
        res.status(201).json({
            id: user._id,
            name: user.name,
            type: user.type,
            email: user.email,
            createdAt: user.createdAt
        });

    } catch (error) {
        res.status(500).json({ error: "Server Error while registering user: " + error.message });
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
        res.status(500).json({ error: "Server Error while updating profile: " + error.message });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const userId = req.userId;
        const { currentPassword, newPassword } = req.body;

        // Basic validation
        if (!currentPassword || !newPassword) {
            return res
                .status(400)
                .json({ error: "Current password and new password are required." });
        }

        const passwordError = validatePassword(newPassword);
        if (passwordError) {
            return res.status(400).json({ error: passwordError });
        }

        const user = await UserModel.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found." });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Current password is incorrect." });
        }

        if (newPassword === currentPassword) {
            return res.status(400).json({
                error: "New password must be different from current password.",
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);
        user.password = hashedPassword;
        await user.save();

        return res
            .status(200)
            .json({ message: "Password updated successfully." });
    } catch (error) {
        return res.status(500).json({
            error: "Server Error while updating password: " + error.message,
        });
    }
};


