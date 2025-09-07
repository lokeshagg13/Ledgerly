const { MongoClient } = require("mongodb");
const UserModel = require("../models/User");
const CategoryModel = require("../models/Category");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

async function migrateDB() {
    try {
        const uri = "mongodb+srv://admin:Lucky%40%40131197@ledgerly-account-mgmt.usntwid.mongodb.net"
        const client = new MongoClient(uri);
        await client.connect();

        const oldDb = client.db("test");
        const newDb = client.db("ledgerly");

        const collections = await oldDb.listCollections().toArray();
        console.log("📂 Collections in old DB:", collections.map(c => c.name));

        for (let col of collections) {
            const name = col.name;
            const docs = await oldDb.collection(name).find().toArray();

            if (docs.length) {
                // optional: clear target collection first
                await newDb.collection(name).deleteMany({});

                await newDb.collection(name).insertMany(docs);
                console.log(`✅ Migrated ${docs.length} docs from ${name}`);
            }
        }

        await client.close();
        console.log("🎉 Migration completed successfully!");
    } catch (error) {
        console.error("❌ Migration failed:", error);
        process.exit(1);
    }
}

async function migrateUsers() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");

        const users = await UserModel.find({});
        console.log(`Found ${users.length} users.`);

        let updatedCount = 0;
        for (const user of users) {
            console.log(user.type)
            if (!user.type) {
                user.type = "individual";
                await user.save();
                updatedCount++;
            }
        }

        console.log(`✅ Updated ${updatedCount} users.`);

        mongoose.connection.close();
        console.log("🎉 Migration completed successfully");
        process.exit(0);
    } catch (err) {
        console.error("❌ Migration failed:", err);
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

async function renameCollection() {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const db = mongoose.connection.db;

    await db.collection("head").rename("heads");

    console.log("Collection renamed from 'heads' to 'head'");
    mongoose.connection.close();
}

migrateDB();
// migrateUsers();
// migrateCategories();
// renameCollection();