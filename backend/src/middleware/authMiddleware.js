const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { isDbConnected } = require('../config/db');
const { getUser } = require('../utils/demoStore');

const getBearerToken = (authHeader = '') => {
  if (!authHeader.startsWith('Bearer ')) {
    return '';
  }
  return authHeader.split(' ')[1];
};

const toRequestUser = (user) => ({
  id: String(user._id),
  _id: user._id,
  role: user.role,
  username: user.username,
  email: user.email,
});

const attachDemoUser = (req, userId) => {
  const demoUser = getUser(userId);
  req.user = toRequestUser(demoUser);
};

const authMiddleware = async (req, res, next) => {
  try {
    const token = getBearerToken(req.headers.authorization || '');
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: token missing' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!isDbConnected()) {
      attachDemoUser(req, decoded.id);
      return next();
    }

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: user not found' });
    }

    req.user = toRequestUser(user);
    return next();
  } catch (error) {
    if (!isDbConnected()) {
      try {
        const token = getBearerToken(req.headers.authorization || '');
        if (token) {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          attachDemoUser(req, decoded.id);
          return next();
        }
      } catch (_fallbackError) {
        // handled below
      }
    }
    return res.status(401).json({ message: 'Unauthorized: invalid token' });
  }
};

module.exports = authMiddleware;
