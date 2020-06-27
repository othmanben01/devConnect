const { verifyToken } = require("../services/auth");

const auth = (req, res, next) => {
  // Get token
  const token = req.header("x-auth-token");

  // check if !token
  if (!token)
    return res.status(401).json({
      errors: {
        message: "No token, authorization denied",
      },
    });

  // Verify token
  try {
    const decoded = verifyToken(token);
    const { user } = decoded;
    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({
      errors: {
        message: "Token is not valid",
      },
    });
  }
};

module.exports = auth;
