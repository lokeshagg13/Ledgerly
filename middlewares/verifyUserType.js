const UserModel = require("../models/User");

// Middleware to allow only individual users
const verifyIndividualUser = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.userId).select("type");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user.type !== "individual") {
            return res.status(403).json({ error: "Access denied: Only individual users allowed" });
        }

        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// Middleware to allow only firm users
const verifyFirmUser = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.userId).select("type");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user.type !== "firm") {
            return res.status(403).json({ error: "Access denied: Only firm users allowed" });
        }

        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// Export both middlewares correctly
module.exports = {
    verifyIndividualUser,
    verifyFirmUser
};
