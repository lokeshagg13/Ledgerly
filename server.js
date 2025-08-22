const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const logger = require("./middlewares/logger");
const errorHandler = require("./middlewares/errorHandler");
const credentials = require("./middlewares/credentials");
const corsOptions = require("./config/corsOptions");
const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");
const sessionRouter = require("./routes/sessionRoutes");
const logoutRouter = require("./routes/logoutRoutes");
const dashboardRouter = require("./routes/dashboardRoutes");
const transactionRouter = require("./routes/transactionRoutes");
const categoryRouter = require("./routes/categoryRoutes");
const subcategoryRouter = require("./routes/subcategoryRoutes");
const headsRouter = require("./routes/headsRoutes");
const entryRouter = require("./routes/entryRoutes");

require("dotenv").config();

const app = express();

// Allow credentials for origin
app.use(credentials);

// Cross origin allow origins
app.use(cors(corsOptions));

// built-in middleware for url encoded data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// built-in middleware cookie parser
app.use(cookieParser());

// logger middleware
app.use(logger);

// Mounting Routers
app.use("/api/user", userRouter);
app.use("/api/user", authRouter);
app.use("/api/user", sessionRouter);
app.use("/api/user", logoutRouter);
app.use("/api/user/dashboard", dashboardRouter);

app.use("/api/user/transactions", transactionRouter);
app.use("/api/user/categories", categoryRouter);
app.use("/api/user/subcategories", subcategoryRouter);

app.use("/api/user/heads", headsRouter);
app.use("/api/user/entries", entryRouter);

// Custom Middleware for handling invalid api paths
app.all("*", (req, res, next) => {
    next(
        new errorHandler(`Can't find ${req.originalUrl} that was requested`, 404)
    );
});

// DB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Database connected"))
    .catch((error) => console.error('❌ Error connecting to the database: ', error));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

