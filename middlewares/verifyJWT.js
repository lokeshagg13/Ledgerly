const jwt = require("jsonwebtoken");
require("dotenv").config();

// Verify JWT middleware for verifying auth header on protected incoming requests
const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json("Auth failed");
  }
  try {
    // Auth token must be of format Bearer <<Auth-Token>>
    const token = authHeader.split(" ")[1];
    // Verifying the auth token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.status(403).json("Invalid token");
      req.email = decoded.email;
      next();
    });
  } catch (error) {
    return res.status(401).json("Auth failed");
  }
};

module.exports = verifyJWT;
