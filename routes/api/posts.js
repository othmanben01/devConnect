const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const _ = require("lodash");
const {
  Post,
  validatePost: validate,
  mapFieldsToPost,
  validateComment,
} = require("../../models/Post");
const { errorsMapsToMessages } = require("../../utils/validate");
const { User } = require("../../models/User");
const { Profile } = require("../../models/Profile");
const { identity } = require("lodash");

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post("/", auth, async (req, res) => {
  const { body } = req;

  // Validate the user input
  const { error } = validate(body);
  if (error) return res.status(400).json(errorsMapsToMessages(error));

  // Create a new post
  try {
    // Get the user from the auth middleware: user
    const user = await User.findById(req.user._id).select("-password");
    console.log(user);
    // Prepare the post
    let postFields = mapFieldsToPost(body);
    postFields = _.assign(postFields, {
      user: req.user._id,
      name: user.name,
      avatar: user.avatar,
    });

    // Create a new post and save
    const post = new Post(postFields);
    await post.save();

    return res.status(200).json(post);
  } catch (err) {
    console.error(err.message, err.stack);
    return res.status(500).send("Server Error");
  }
});

// @route   GET api/posts
// @desc    Get all posts
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    return res.status(200).json(posts);
  } catch (err) {
    console.error(err.message, err.stack);
    return res.status(500).send("Server Error");
  }
});

// @route   GET api/posts/:id
// @desc    Get a post by id
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post)
      return res.status(404).json({
        errors: { message: "Post not found" },
      });

    return res.status(200).json(post);
  } catch (err) {
    if (err.kind === "ObjectId")
      return res.status(404).json({
        errors: { message: "Post not found" },
      });
    console.error(err.message, err.stack);
    return res.status(500).send("Server Error");
  }
});

// @route   DELETE api/posts/:id
// @desc    Delete a post by id
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post)
      return res.status(404).json({
        errors: { message: "Post not found" },
      });

    // Check if the authenticated user own the post
    if (post.user.toString() !== req.user._id)
      return res.status(401).json({ errors: "User not authorized" });

    await post.remove();

    return res.status(200).json({ message: "Post has been deleted" });
  } catch (err) {
    if (err.kind === "ObjectId")
      return res.status(404).json({
        errors: { message: "Post not found" },
      });
    console.error(err.message, err.stack);
    return res.status(500).send("Server Error");
  }
});

// @route   PUT api/posts/like/:id
// @desc    Like a post
// @access  Private
router.put("/like/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    // get the post
    const post = await Post.findById(id);

    // Check if the post has already been liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user._id)
        .length > 0
    )
      return res
        .status(400)
        .json({ errors: { message: "Post already liked" } });

    post.likes.unshift({ user: req.user._id });

    await post.save();

    return res.json(post.likes);
  } catch (err) {
    if (err.kind === "ObjectId")
      return res.status(404).json({
        errors: { message: "Post not found" },
      });
    console.error(err.message, err.stack);
    return res.status(500).send("Server Error");
  }
});

// @route   PUT api/posts/unlike/:id
// @desc    Unlike a post
// @access  Private
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    console.log(req.params);
    const { id } = req.params;
    // get the post
    const post = await Post.findById(id);

    // Check if the post has already been liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user._id)
        .length === 0
    )
      return res
        .status(400)
        .json({ errors: { message: "Post has not yet been liked" } });

    // Get the remove index
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user._id);

    post.likes.splice(removeIndex, 1);
    await post.save();

    return res.json(post.likes);
  } catch (err) {
    if (err.kind === "ObjectId")
      return res.status(404).json({
        errors: { message: "Post not found" },
      });
    console.error(err.message, err.stack);
    return res.status(500).send("Server Error");
  }
});

// @route   POST api/posts/comment/:id
// @desc    Comment on a post
// @access  Private
router.post("/comment/:id", auth, async (req, res) => {
  const { body } = req;
  const { id } = req.params;

  // Validate the user input
  const { error } = validateComment(body);
  if (error) return res.status(400).json(errorsMapsToMessages(error));

  // Create a comment
  try {
    // Get the user from the auth middleware: user & post id from params
    const user = await User.findById(req.user._id).select("-password");
    const post = await Post.findById(id);

    // Prepare the comment
    const newComment = {
      text: body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user._id,
    };

    // Add the comment
    post.comments.unshift(newComment);

    await post.save();

    return res.status(200).json(post.comments);
  } catch (err) {
    if (err.kind === "ObjectId")
      return res.status(404).json({
        errors: { message: "Post not found" },
      });
    console.error(err.message, err.stack);
    return res.status(500).send("Server Error");
  }
});

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Delete Comment
// @access  Private
router.delete("/comments/:id/:comment_id", auth, async (req, res) => {
  try {
    const { id, comment_id } = req.params;
    const { _id } = req.user;

    const post = await Post.findById(id);

    // Pull out comment
    const comment = post.comments.find((comment) => comment.id === comment_id);

    // Make sure comment exists
    if (!comment)
      return res
        .status(404)
        .json({ errors: { message: "Comment does not exist" } });

    // check if the user own the comment
    if (comment.user.toString() !== _id)
      return res
        .status(401)
        .json({ errors: { message: "User not authorized" } });

    // Get the remove index
    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user._id);

    post.comments.splice(removeIndex, 1);
    await post.save();

    return res.json(post.comments);
  } catch (err) {
    if (err.kind === "ObjectId")
      return res.status(404).json({
        errors: { message: "Post not found" },
      });
    console.error(err.message, err.stack);
    return res.status(500).send("Server Error");
  }
});
module.exports = router;
