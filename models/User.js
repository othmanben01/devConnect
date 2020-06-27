const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("user", UserSchema);

// User validator
function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(55).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    avatar: Joi.string(),
  });

  return schema.validate(user, { abortEarly: false });
}

module.exports = {
  User,
  validateUser,
};
