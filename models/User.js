const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
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
                        uptoDate: null,
                        selectedCategories: []
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

// Optional: pre-save hook to automatically remove it if type is firm
userSchema.pre("save", function (next) {
    if (this.type === "firm") {
        this.customBalanceCard = undefined;
    }
    next();
});

const userModel = mongoose.model("userModel", userSchema, "users");

module.exports = userModel;
