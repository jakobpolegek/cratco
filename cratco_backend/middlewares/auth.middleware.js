import jwt from 'jsonwebtoken';
import { JWT_SECRET, PUBLIC_LINKS_SECRET } from '../config/env.js';
import User from '../models/user.model.js';

export const authorize = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      const error = new Error('Unauthorized.');
      error.status = 401;
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: 'Unauthorized.', error: error.message });
  }
};

export const authorizePublicUrl = async (req, res, next) => {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      const token = req.headers.authorization.split(' ')[1];
      if (token === PUBLIC_LINKS_SECRET) {
        return next();
      }
    }

    const error = new Error('Unauthorized.');
    error.status = 401;
    throw error;
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: 'Unauthorized.', error: error.message });
  }
};
