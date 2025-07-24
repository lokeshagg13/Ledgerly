const mongoose = require("mongoose");
const UserModel = require("../models/User"); // Adjust the path as needed
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

async function migrateUsers() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");

        const users = await UserModel.find();
        console.log(`Found ${users.length} users to update`);

        for (const user of users) {
            // Add openingBalance if missing
            user.customBalanceCard = {
                title: "Filtered Balance",
                filters: {
                    uptoDate: null,
                    selectedCategories: []
                }
            };


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
