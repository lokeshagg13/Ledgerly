const allowedOrigins = require("../config/allowedOrigins");

// Access-Control-Allow-Credentials must be sent back in the response so that when front end sends the next request,
// the withCredentials true can be used to attach the cookie (containing refresh token) with the request automatically
// (On front end, cookie attachment must be automatic as HTTP only cookie cant be accessed manually in Javascript because of security issues)
const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", true);
  }
  next();
};

module.exports = credentials;
