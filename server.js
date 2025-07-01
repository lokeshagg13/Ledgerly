const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const errorHandler = require("./middlewares/errorHandler");
const credentials = require("./middlewares/credentials");
const corsOptions = require("./config/corsOptions");
const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");
const sessionRouter = require("./routes/sessionRoutes");
const logoutRouter = require("./routes/logoutRoutes");

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

// Mounting Routers
app.use("/api/user", userRouter);
app.use("/api/user", authRouter);
app.use("/api/user", sessionRouter);
app.use("/api/user", logoutRouter);

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

