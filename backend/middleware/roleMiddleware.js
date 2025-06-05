// Middleware to check if logged-in user has required roles

const authorizeRoles = (allowedRoles) => {
  return (req, res, next) => {
    // Check if user is attached to request (by protect middleware)
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Check if user's role is in allowedRoles array
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied: insufficient permissions" });
    }

    // User has required role - proceed
    next();
  };
};

module.exports = { authorizeRoles };
