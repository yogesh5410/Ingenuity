// middlewares/admin.js

import UserModel from "../models/user.model.js";

/**
 * Middleware to check if the authenticated user has admin privileges.
 */
export const admin = async (req, res, next) => {
  try {
    const userId = req.userId;

    // Fetch user from the database
    const user = await UserModel.findById(userId);

    // Check if the user exists and has 'ADMIN' role
    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({
        message: 'Access denied. Admins only.',
        success: false,
        error: true,
      });
    }

    // Proceed if user is admin
    next();
  } catch (error) {
    return res.status(500).json({
      message: 'Server error while verifying admin privileges.',
      success: false,
      error: true,
    });
  }
};
