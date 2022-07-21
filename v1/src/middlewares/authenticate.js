const httpStatus = require("http-status");
const jwt = require("jsonwebtoken");
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Bearer token
  if (token == null) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message: "You must login",
    });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (error, user) => {
    if (error) {
      return res.status(httpStatus.FORBIDDEN).json({
        success: false,
        message: "Your session has been expired.",
      });
    }
    req.user = user?._doc;
    next();
  });
};

module.exports = authenticateToken;
