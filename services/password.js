const bcrypt = require("bcryptjs");
const config = require("config");

const saltRounds = config.get("hash.saltRounds");

const hash = async (password) => {
  // get the salt
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(password, salt);
};

const compare = async (password, encryptedPassword) =>
  await bcrypt.compare(password, encryptedPassword);

module.exports = {
  hash,
  compare,
};
