const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { User } = require("../../models/User");
const Joi = require("@hapi/joi");
const { compare } = require("../../services/password");
const { errorsMapsToMessages } = require("../../utils/validate");
const _ = require("lodash");
const { createToken } = require("../../services/auth");

// @route   GET api/auth
// @desc    Get a user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    return res.status(200).json(user);
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Server Error");
  }
});

// @route   POST api/auth
// @desc    Authenticate a User
// @access  Public
router.post("/", async (req, res) => {
  const { body } = req;
  // validate the user input
  const { error } = validate(body);
  if (error) return res.status(400).json(errorsMapsToMessages(error));

  try {
    const { email, password } = body;
    // Check if the user exists
    let user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ errors: { message: "Invalid Credentials" } });

    // validate password
    const isPassMatch = await compare(password, user.get("password"));

    if (!isPassMatch)
      return res
        .status(400)
        .json({ errors: { message: "Invalid Credentials" } });

    // Create jsonwebtoken
    const payload = {
      user: formatUser(user),
    };
    const token = createToken(payload);

    // Return token
    res.status(200).json(token);
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Server Error");
  }
});

const formatUser = (user) => _.pick(user, ["_id", "name", "email", "avatar"]);

// User validator
function validate(body) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(body, { abortEarly: false });
}

module.exports = router;
