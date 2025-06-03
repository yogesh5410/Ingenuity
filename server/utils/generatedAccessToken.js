import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

/**
 * Generate a short-lived access token for the user.
 * @param {String} userId - The ID of the user.
 * @returns {String} - The generated access token.
 */
const generateAccessToken = async (userId) => {
  try {
    const token = jwt.sign(
      { id: userId },
      process.env.SECRET_KEY_ACCESS_TOKEN,
      { expiresIn: "1h" }
    );

    return token;
  } catch (error) {
    console.error("Error generating access token:", error);
    throw new Error("Failed to generate access token");
  }
};

export default generateAccessToken;
