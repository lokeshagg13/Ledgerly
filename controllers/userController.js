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
