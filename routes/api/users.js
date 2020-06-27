const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const _ = require("lodash");
const { User, validateUser: validate } = require("../../models/User");
const { errorsMapsToMessages } = require("../../utils/validate");
const { hash } = require("../../services/password");
const { createToken } = require("../../services/auth");

// @route   POST api/users
// @desc    Register User
// @access  Public
router.post("/", async (req, res) => {
  const { body } = req;
  // validate the user input
  const { error } = validate(body);
  if (error) return res.status(400).json(errorsMapsToMessages(error));

  try {
    const { name, email, password } = body;
    // Check if the user exists
    let user = await User.findOne({ email });
    if (user)
      return res
        .status(400)
        .json({ errors: { message: "User already exist" } });

    // Create user gravatar
    const avatar = gravatar.url(email, {
      s: "200",
      r: "pg",
      d: "mm",
    });

    // Create a new User
    user = new User({ name, email, password, avatar });

    // Hash the password
    user.password = await hash(password);

    // save the user in db
    await user.save();

    // Create jsonwebtoken
    const payload = {
      user: formatUser(user),
    };
    const token = createToken(payload);

    // Return token
    res.status(200).json(token);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
});

const formatUser = (user) => _.pick(user, ["_id", "name", "email", "avatar"]);

module.exports = router;
