const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // Check if jsonwebtoken exists and is verified
  if (token) {
    jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
      if (err) {
        req.user = null; // Set user to null or handle the absence of a user object as needed
      } else {
        req.user = decodedToken; // Set the user object on the request
      }
      next();
    });
  } else {
    req.user = null; // Set user to null when there's no token
    next();
  }
};

module.exports = { requireAuth };
