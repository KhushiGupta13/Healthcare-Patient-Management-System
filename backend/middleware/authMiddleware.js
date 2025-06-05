const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT token verify karke user ko authorize karne wala middleware
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check karo ki authorization header aur token hai ya nahi
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }

  // Token extract karo
  const token = authHeader.split(' ')[1];

  try {
    // Token verify karo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // User ko DB se find karo, password hata ke
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    // User info request object me attach karo taaki next middleware ya routes me use kar sake
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token invalid' });
  }
};

module.exports = { protect };
