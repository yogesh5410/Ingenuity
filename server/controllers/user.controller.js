import bcrypt from 'bcryptjs';
import UserModel from '../models/user.model.js';
import generatedAccessToken from '../utils/generatedAccessToken.js'
import generatedRefreshToken from '../utils/generatedRefreshToken.js'
import dotenv from "dotenv";
dotenv.config();

export async function register(req, res) {
  try {
    const { name, email, password, cf_id, lc_id } = req.body;

    // Basic validation (you can do more with express-validator in routes)
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'Name, email, and password are required'
      });
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save new user
    const user = new UserModel({
      name,
      email,
      password: hashedPassword,
      codeforces_id: cf_id,
      leetcode_id: lc_id,
    });

    await user.save();

    return res.status(201).json({
      success: true,
      error: false,
      message: 'Registration successful',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        cf_id: user.codeforces_id,
        lc_id: user.leetcode_id,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: true,
      message: 'Server error during registration'
    });
  }
}


export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'Email and password are required'
      });
    }

    // Check if user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'Email not found'
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'Password does not match'
      });
    }

    // Generate tokens
    const accessToken = await generatedAccessToken(user._id);
    const refreshToken = await generatedRefreshToken(user._id);

    // Update last login date and store refresh token if needed
    await UserModel.findByIdAndUpdate(user._id, {
      last_login_date: new Date(Date.now()),
      refresh_token: refreshToken
    });

    // Cookie options
    const cookiesOption = {
      httpOnly: true,
      secure: true,  // set to false in local dev without HTTPS
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
    };

    // Set cookies
    res.cookie('accessToken', accessToken, cookiesOption);
    res.cookie('refreshToken', refreshToken, cookiesOption);

    // Success response with tokens and user info
    return res.status(200).json({
      success: true,
      error: false,
      message: 'Login successful',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        cf_id: user.codeforces_id,
        lc_id: user.leetcode_id
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: true,
      message: 'Server error during login'
    });
  }
}



//reset password function
export async function forgotPassword(req, res) {
  try {
    const { email, newPassword } = req.body;

    // Check if required fields are present
    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'Email and new password are required',
      });
    }

    // Check if user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: true,
        message: 'User with this email does not exist',
      });
    }
    console.log("User found:", user);

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      error: false,
      message: 'Password has been reset successfully',
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: true,
      message: 'Server error during password reset',
    });
  }
}

// logout function
export async function logout(req, res) {
  try {
    const userId = req.userId; // Set by auth middleware after verifying token

    // Cookie options (same as used in login)
    const cookiesOption = {
      httpOnly: true,
      secure: true,  // set to false in local dev without HTTPS
      sameSite: 'None',
    };

    // Clear auth cookies
    res.clearCookie('accessToken', cookiesOption);
    res.clearCookie('refreshToken', cookiesOption);

    // Remove refresh token from DB
    await UserModel.findByIdAndUpdate(userId, {
      refresh_token: ''
    });

    // Success response
    return res.status(200).json({
      success: true,
      error: false,
      message: 'Logout successful'
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: true,
      message: err.message || 'Server error during logout'
    });
  }
}




/**
 * Refresh access token using a valid refresh token.
 * @param {Object} request - Express request object.
 * @param {Object} response - Express response object.
 */
export async function refreshToken(request, response) {
  try {
    const tokenFromCookie = request.cookies?.refreshToken;
    const tokenFromHeader = request.headers?.authorization?.split(" ")[1];
    const refreshToken = tokenFromCookie || tokenFromHeader;

    if (!refreshToken) {
      return response.status(401).json({
        success: false,
        error: true,
        message: "Refresh token is missing or invalid",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN);
    } catch (err) {
      return response.status(401).json({
        success: false,
        error: true,
        message: "Refresh token is expired or invalid",
      });
    }

    const userId = decoded.id;
    const newAccessToken = await generatedAccessToken(userId);

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    response.cookie("accessToken", newAccessToken, cookieOptions);

    return response.status(200).json({
      success: true,
      error: false,
      message: "New access token generated successfully",
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    console.error("Error in refreshToken controller:", error);
    return response.status(500).json({
      success: false,
      error: true,
      message: error.message || "Internal server error",
    });
  }
}



/**
 * @desc    Get details of the currently logged-in user
 * @route   GET /api/user/details
 * @access  Private (requires auth middleware to populate req.userId)
 */
export const getUserDetails = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: true,
        message: 'Unauthorized: No user ID provided in request',
      });
    }

    let user = await UserModel.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({
        error: true,
        success: false,
        message: 'User not found',
      });
    }

    const todayStr = new Date().toISOString().slice(0, 10);

    if (user.todayHintDate !== todayStr) {
      await UserModel.findByIdAndUpdate(
        userId,
        {
          todayHintUnlocks: [],
          todayHintDate: todayStr,
        },
        { new: true }
      );
      user = await UserModel.findById(userId).select('-password');
    }

    res.status(200).json({
      error: false,
      success: true,
      message: 'User details fetched successfully',
      data: {
        name: user.name,
        email: user.email,
        points: user.points,
        leetcode: user.leetcode_id,
        codeforces: user.codeforces_id,
        solvedDates: user.solvedDates,
        todayHintUnlocks: user.todayHintUnlocks,
        todayHintDate: user.todayHintDate,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Error in getUserDetails:', err);
    res.status(500).json({
      error: true,
      message: 'Internal Server Error. Please try again later.',
    });
  }
};



export async function updateProgress(req, res) {
  try {
    const userId = req.userId; // From auth middleware
    const { points, solvedDates, todayHintUnlocks, todayHintDate } = req.body;

    const updateFields = {};

    if (points !== undefined) updateFields.points = points;
    if (solvedDates !== undefined) updateFields.solvedDates = solvedDates;
    if (todayHintUnlocks !== undefined) updateFields.todayHintUnlocks = todayHintUnlocks;
    if (todayHintDate !== undefined) updateFields.todayHintDate = todayHintDate;

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'No valid progress fields provided to update',
      });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: true,
        message: 'User not found',
      });
    }

    const {
      password, refresh_token, email, role,
      ...progressData
    } = updatedUser.toObject();

    return res.status(200).json({
      success: true,
      error: false,
      message: 'Progress updated successfully',
      data: progressData,
    });

  } catch (err) {
    console.error('Error updating progress:', err);
    return res.status(500).json({
      success: false,
      error: true,
      message: 'Server error while updating progress',
    });
  }
}
