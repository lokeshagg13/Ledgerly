const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");

require("dotenv").config();

// Handling refreshing of sessions
exports.handleRefreshToken = async (req, res) => {
  try {

    // Check if JWT cookie exist in request body
    const cookies = req.cookies;
    if (!cookies?.jwt) {
      return res.status(401).json({ error: "Auth failed" });
    }

    const refreshToken = cookies.jwt;

    // Check if refresh token exist in the DB
    const user = await UserModel.findOne({ refreshToken: refreshToken });
    if (!user) {
      return res.status(401).json({ error: "Refresh token is invalid" });
    }

    // Verify the refresh token and create a new access token
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || decoded.email !== user.email || decoded.type !== user.type) {
          return res.status(403).json({ error: "Refresh token is invalid" });
        }
        const accessToken = jwt.sign(
          {
            email: decoded.email,
            userId: user._id,
            type: decoded.type
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: `${process.env.ACCESS_TOKEN_EXPIRY}` }
        );
        res.status(200).json({
          email: decoded.email,
          type: decoded.type,
          name: user.name,
          accessToken,
          createdAt: user.createdAt,
          openingBalance: user.openingBalance
        });
      }
    );
  } catch (error) {
    res
      .status(500)
      .json({ error: "Server Error while refreshing session: " + error.message });
  }
};
