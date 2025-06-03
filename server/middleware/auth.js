// middlewares/auth.js

import jwt from 'jsonwebtoken';

/**
 * Middleware to authenticate requests using JWT access tokens.
 */
const auth = async (req, res, next) => {
  try {
    // Extract token from cookies or Authorization header (Bearer <token>)
    const token =
      req.cookies?.accessToken ||
      req.headers?.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        message: 'Access token not provided',
        success: false,
        error: true,
      });
    }

    // Verify token and decode user info
    const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);

    if (!decoded) {
      return res.status(401).json({
        message: 'Unauthorized access - invalid token',
        success: false,
        error: true,
      });
    }

    // Attach user ID to request for downstream use
    req.userId = decoded.id;

    next();
  } catch (err) {
    return res.status(500).json({
      message: 'Authentication failed. Please log in again.',
      success: false,
      error: true,
    });
  }
};

export default auth;
