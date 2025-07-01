const allowedOrigins = require("./allowedOrigins");

// Allowing cross origin requests from specific origins allowed (e.g. api tester ThunderClient or frontend react app)
module.exports = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};
