const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");

require("dotenv").config();

// Controller for logging user in
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Checking if the login body is correct
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Invalid request for user login" });
    }

    // Checking if the email has the correct format
    if (
      /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/gm.test(email) === false
    ) {
      return res.status(400).json({ error: "Invalid user email" });
    }

    // Check if email is registered or not
    const user = await UserModel.find({ email: email });
    if (user.length == 0) {
      return res.status(401).json({ error: "User is not registered" });
    }

    const passwordMatch = await bcrypt.compare(password, user[0].password);
    if (!passwordMatch) {
      return res.status(400).json({ error: "Invalid login credentials" });
    }

    // Created using node command require("crypto").randomBytes(64).toString("hex")
    const accessToken = jwt.sign(
      {
        email: email,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: `${process.env.ACCESS_TOKEN_EXPIRY}` }
    );
    // Create refresh token to allow user to refresh their accessToken 
    const refreshToken = jwt.sign(
      {
        email: email,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: `${process.env.REFRESH_TOKEN_EXPIRY}` }
    );

    // Set refresh tokens in the user DB so as to allow early logouts from user (when user logs out before the expiry of
    // refresh tokens)
    await UserModel.updateOne(
      { email: email },
      { $set: { refreshToken: refreshToken } }
    );
    // Refresh tokens will be HTTP only so that they cant be accessed within Javascript
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    // Send back in response body only the accessToken
    res.status(200).json({
      accessToken,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Unknown error occurred: " + error.message });
  }
};
