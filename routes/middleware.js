const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.header("AUTH_TOKEN");
    if (!token) {
      const error = new Error("Invalid token!!");
      error.statusCode = 403;
      throw error;
    }
    const verified = jwt.verify(token, process.env.TOP_SECRET);
    if (!verified) {
      const error = new Error("User session timed out!!");
      error.statusCode = 403;
      throw error;
    }
    req.user = verified;
    next();
  } catch (err) {
    err.statusCode = 403;
    next(err);
  }
};
