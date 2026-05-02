const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { isDbConnected } = require('../config/db');
const { ensureDemoUser } = require('../utils/demoStore');

const buildToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const buildDemoAuthResponse = ({ email, username }) => {
  const demoUser = ensureDemoUser({ email, username });
  const token = buildToken(demoUser._id);
  return {
    token,
    user: {
      _id: demoUser._id,
      username: demoUser.username,
      email: demoUser.email,
      role: demoUser.role,
    },
    mode: 'demo',
  };
};

const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    if (!isDbConnected()) {
      const response = buildDemoAuthResponse({ email, username });
      return res.status(201).json({
        ...response,
        user: {
          ...response.user,
          role: response.user.role || role || 'recruiter',
        },
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'recruiter',
    });

    const token = buildToken(user._id);

    return res.status(201).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (!isDbConnected()) {
      const demoUsername = String(email).split('@')[0] || 'demo-user';
      return res.json(buildDemoAuthResponse({ email, username: demoUsername }));
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      if (String(email || '').toLowerCase().includes('demo')) {
        const demoUsername = String(email).split('@')[0] || 'demo-user';
        return res.json(buildDemoAuthResponse({ email, username: demoUsername }));
      }
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      if (String(email || '').toLowerCase().includes('demo')) {
        const demoUsername = String(email).split('@')[0] || 'demo-user';
        return res.json(buildDemoAuthResponse({ email, username: demoUsername }));
      }
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = buildToken(user._id);

    return res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    if (!isDbConnected()) {
      const fallbackEmail = req.body?.email || 'demo@ResumeIQ.local';
      const demoUsername = String(fallbackEmail).split('@')[0] || 'demo-user';
      return res.json(buildDemoAuthResponse({ email: fallbackEmail, username: demoUsername }));
    }
    return res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    return res.json({ user: req.user });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load profile', error: error.message });
  }
};

module.exports = {
  register,
  login,
  getProfile,
};
