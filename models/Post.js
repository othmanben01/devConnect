const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const _ = require("lodash");

const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  text: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  avatar: {
    type: String,
  },
  likes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    },
  ],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
      name: {
        type: String,
      },
      text: {
        type: String,
        required: true,
      },
      avatar: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model("post", PostSchema);

// Construct the post
const mapFieldsToPost = (body) => {
  // Get profile post fields
  let post = _.pick(body, [
    "text",
    "likedBy",
    "commentedBy",
    "commentText",
    "commentAvatar",
  ]);
  return post;
};

// Post validator
function validatePost(post) {
  const schema = Joi.object({
    text: Joi.string().required(),
    likedBy: Joi.string(),
    commentedBy: Joi.string(),
    commentText: Joi.string(),
    commentAvatar: Joi.string(),
  });

  return schema.validate(post, { abortEarly: false });
}

// Comment validator
function validateComment(comment) {
  const schema = Joi.object({
    text: Joi.string().required(),
    name: Joi.string(),
    avatar: Joi.string(),
  });

  return schema.validate(comment, { abortEarly: false });
}

module.exports = {
  Post,
  validatePost,
  mapFieldsToPost,
  validateComment,
};
