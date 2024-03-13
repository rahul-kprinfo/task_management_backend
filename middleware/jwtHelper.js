const jwt = require("jsonwebtoken");

function isValidToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    return true;
  } catch (error) {
    return false;
  }
}

module.exports = isValidToken;
