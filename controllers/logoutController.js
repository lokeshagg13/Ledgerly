/* eslint-disable guard-for-in */
/* eslint-disable no-console */
/* eslint-disable node/no-unsupported-features/es-syntax */
const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");

require("dotenv").config();

// Handling logout
exports.logoutUser = async (req, res) => {
  try {
    const cookies = req.cookies;
    console.log(cookies)
    // Check if jwt cookie exist in the request
    if (!cookies?.jwt) {
      console.log('FAILS HERE!! no cookie found')// fails here
      return res.status(401).json({ error: "Auth failed" });
    }

    const refreshToken = cookies.jwt;

    // Check if email is registered or not
    const user = await UserModel.find({ refreshToken: refreshToken });
    if (user.length == 0) {
      // Clear the JWT cookie
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
      return res.status(204).json({ message: "Logout successful" });
    }

    // Set the refresh token in DB to ""
    await UserModel.updateOne(
      {
        email: user[0].email,
      },
      {
        $set: { refreshToken: "" },
      }
    );
    // Clear the JWT cookie
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.status(204).json({ message: "Logout successful" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Unknown error occurred: " + error.message });
  }
};
