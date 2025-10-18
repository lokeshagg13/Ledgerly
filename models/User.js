const mongoose = require("mongoose");
const Head = require("./Head");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    refreshToken: {
        type: String,
        default: "",
    },
    type: {
        type: String,
        enum: ["individual", "firm"],
        required: true,
        default: "individual"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    openingBalance: {
        amount: {
            type: Number,
            default: 0
        },
        lastUpdated: {
            type: Date,
            default: Date.now
        }
    },
    customBalanceCard: {
        type: {
            title: {
                type: String,
                required: true,
                trim: true,
                default: "Filtered Balance"
            },
            filters: {
                uptoDate: {
                    type: Date,
                    default: null
                },
                selectedCategories: {
                    type: [mongoose.Schema.Types.ObjectId],
                    ref: "categoryModel",
                    default: []
                }
            }
        },
        default: function () {
            if (this.type === "individual") {
                return {
                    title: "Filtered Balance",
                    filters: {
                        uptoDate: null,selectedCategories: []
                    }
                };
            }
            return undefined;
            
        },
        validate: {
            validator: function (value) {
                return this.type === "individual" || value === undefined || value === null;
            },
            message: "custom balance card is only allowed for individual users."
        }
    }
});

// Pre-save: clear customBalanceCard for firms
userSchema.pre("save", function (next) {
    if (this.type === "firm") {
        this.customBalanceCard = undefined;
    }
    next();
});

// Post-save: auto-create CASH head for firm users
userSchema.post("save", async function (doc, next) {
    try {
        if (doc.isNew && doc.type === "firm") {
            const existing = await Head.findOne({ userId: doc._id, name: "CASH" });
            if (!existing) {
                await Head.create({
                    userId: doc._id,
                    name: "CASH",
                    openingBalance: {
                        amount: 0,
                        lastUpdated: new Date()
                    }
                });
            }
        }
        next();
    } catch (err) {
        console.error("Error creating CASH head:", err);
        next(err); // or next() to avoid blocking user save
    }
});

userSchema.index({ email: 1, type: 1 }, { unique: true });

const userModel = mongoose.model("userModel", userSchema, "users");

module.exports = userModel;
