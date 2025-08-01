const mongoose = require("mongoose");
const UserModel = require("../models/User"); 
const CategoryModel = require("../models/Category");
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

async function migrateCategories() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");

        const backup = await CategoryModel.find({});
        console.log(`🔄 Backed up ${backup.length} categories`);

        // Clear the collection
        await CategoryModel.deleteMany({});
        console.log("🗑️  Deleted all existing categories");

        if (backup.length > 0) {
            // Reinsert to re-apply validation + new indexes
            await CategoryModel.insertMany(backup);
            console.log(`✅ Reinserted ${backup.length} categories`);
        }

        console.log("🎉 Migration completed successfully");
        process.exit(0);
    } catch (err) {
        console.error("❌ Migration failed:", err);
        process.exit(1);
    }
}

// migrateUsers();
migrateCategories();