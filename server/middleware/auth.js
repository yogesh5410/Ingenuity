// middlewares/auth.js

import jwt from 'jsonwebtoken';

/**
 * Middleware to authenticate requests using JWT access tokens.
 */
const auth = async (req, res, next) => {
  try {
    let token;

    // Safely extract token from cookie or Authorization header
    if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    } else if (req.headers?.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Token missing
    if (!token) {
      return res.status(401).json({
        message: 'Access token not provided',
        success: false,
        error: true,
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);

    // Attach user ID to request
    req.userId = decoded.id;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Access token expired',
        success: false,
        error: true,
      });
    }

    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: 'Invalid access token',
        success: false,
        error: true,
      });
    }

    return res.status(500).json({
      message: 'Authentication failed. Please log in again.',
      success: false,
      error: true,
    });
  }
};

export default auth;
