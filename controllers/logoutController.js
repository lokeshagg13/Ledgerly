const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");

require("dotenv").config();

// Handling logout
exports.logoutUser = async (req, res) => {
  try {
    const cookies = req.cookies;
    // Check if jwt cookie exist in the request
    if (!cookies?.jwt) {
      return res.status(401).json({ error: "Auth failed" });
    }

    const refreshToken = cookies.jwt;

    // Check if email is registered or not
    const user = await UserModel.findOne({ refreshToken });
    if (!user) {
      // Clear the JWT cookie
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        secure: process.env.NODE_ENV === "production",
      });
      return res.status(204).json({ message: "Logout successful" });
    }

    // Set the refresh token in DB to ""
    await UserModel.updateOne(
      {
        _id: user._id,
      },
      {
        $set: { refreshToken: "" },
      }
    );
    // Clear the JWT cookie
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: process.env.NODE_ENV === "production"
    });
    return res.status(204).json({ message: "Logout successful" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Unknown error occurred: " + error.message });
  }
};
