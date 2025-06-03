import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

/**
 * Generate and store a refresh token for the user.
 * @param {String} userId - The ID of the user.
 * @returns {String} - The generated refresh token.
 */
const generateRefreshToken = async (userId) => {
  try {
    // Generate JWT refresh token with 7 days expiration
    const token = jwt.sign(
      { id: userId },
      process.env.SECRET_KEY_REFRESH_TOKEN,
      { expiresIn: "7d" }
    );

    // Update user document with new refresh token
    await UserModel.updateOne(
      { _id: userId },
      { refresh_token: token }
    );

    return token;
  } catch (error) {
    console.error("Error generating refresh token:", error);
    throw new Error("Failed to generate refresh token");
  }
};

export default generateRefreshToken;
