const jwt = require("jsonwebtoken");
require("dotenv").config();

// Verify JWT middleware for verifying auth header on protected incoming requests
const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Auth failed" });
  }
  try {
    // Auth token must be of format Bearer <<Auth-Token>>
    const token = authHeader.split(" ")[1];
    // Verifying the auth token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ error: "Invalid token" });
      req.email = decoded.email;
      req.userId = decoded.userId;
      next();
    });
  } catch (error) {
    return res.status(401).json({ error: "Auth failed" });
  }
};

module.exports = verifyJWT;
