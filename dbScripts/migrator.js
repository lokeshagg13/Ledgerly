const mongoose = require("mongoose");
const UserModel = require("../models/User"); // Adjust the path as needed
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

async function migrateUsers() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");

        const users = await UserModel.find({
            $or: [
                { openingBalance: { $exists: false } },
                { accountBalance: { $exists: true } },
                { lastUpdatedOn: { $exists: true } }
            ]
        });
        console.log(`Found ${users.length} users to update`);

        for (const user of users) {
            // Add openingBalance if missing
            if (!user.openingBalance) {
                user.openingBalance = {
                    amount: 0,
                    lastUpdated: user.createdAt || new Date()
                };
            }

            // Remove old fields
            if (user.accountBalance !== undefined) {
                user.set("accountBalance", undefined, { strict: false });
            }
            if (user.lastUpdatedOn !== undefined) {
                user.set("lastUpdatedOn", undefined, { strict: false });
            }

            await user.save();
            console.log(`Migrated user: ${user.email}`);
        }

        console.log("Migration complete");
        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
}

migrateUsers();
