const jwt = require("jsonwebtoken");
const config = require("config");

const { jwtSecret, expiresIn } = config.get("auth");

const createToken = (payload) => ({
  token: jwt.sign(payload, jwtSecret, { expiresIn }),
});

const verifyToken = (token) => jwt.verify(token, jwtSecret);

module.exports = {
  createToken,
  verifyToken,
};
