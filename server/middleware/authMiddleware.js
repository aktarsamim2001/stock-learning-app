import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const protect = async (req, res, next) => {
  let token;

  console.log('req.headers.authorization ' + req.headers.authorization);

  // Check for token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      console.log('token : ' + token);

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');


      console.log('decoded : ' + decoded);
      console.log(decoded)

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');
      console.log('req.user : ' + req.user);
      console.log('req.user.id : ' + req.user.id);

      console.log(req.user)

      next();
    } catch (error) {
      console.log('error')
      console.log(error)
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as admin' });
  }
};

export const instructor = (req, res, next) => {
  if (req.user && (req.user.role === 'instructor' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as instructor' });
  }
};

export const checkRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (req.user.role !== role && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized for this role' });
    }

    next();
  };
};

// For compatibility with existing imports
export { protect as authMiddleware };

// For compatibility with routes expecting 'authenticateAdmin'
export const authenticateAdmin = [protect, admin];