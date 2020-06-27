const express = require("express");
const router = express.Router();
const _ = require("lodash");
const request = require("request");
const config = require("config");
const auth = require("../../middleware/auth");
const {
  Profile,
  validateProfile: validate,
  validateProfileExperience,
  validateProfileEducation,
  mapFieldsToProfile,
  mapFieldsToExperience,
  mapFieldsToEducation,
} = require("../../models/Profile");
const { User } = require("../../models/User");
const { Post } = require("../../models/Post");
const { errorsMapsToMessages } = require("../../utils/validate");
const { getGithubProfile } = require("../../services/api");

// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private
router.get("/me", auth, async (req, res) => {
  try {
    // Find Profile
    const profile = await Profile.findOne({
      user: req.user._id,
    }).populate("user", ["name", "avatar"]);

    // Verify if profile exists
    if (!profile)
      return res
        .status(400)
        .json({ errors: { message: "There is no profile for this user" } });

    // Return profile
    return res.status(200).json(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
});

// @route   POST api/profile
// @desc    Create a new user profile
// @access  Private
router.post("/", auth, async (req, res) => {
  // Validation
  const { body } = req;
  const { error } = validate(body);
  if (error) return res.status(400).json(errorsMapsToMessages(error));

  // Build the profile sample from the user input fields
  const profileFields = mapFieldsToProfile(body);
  profileFields.user = req.user._id;

  // Create a new profile
  try {
    let profile = await Profile.findOne({ user: req.user._id });
    if (profile)
      return res.status(400).json({
        errors: { message: "The profile attached to the user already exists" },
      });
    profile = new Profile(profileFields);
    await profile.save();

    return res.status(200).json(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
});

router.put("/", auth, async (req, res) => {
  // Validation
  const { body } = req;
  const { error } = validate(body);
  if (error) return res.status(400).json(errorsMapsToMessages(error));

  // Build the profile sample from the user input fields
  const profileFields = mapFieldsToProfile(body);
  profileFields.user = req.user._id;

  // Update the profile
  try {
    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $set: profileFields },
      { new: true }
    );
    return res.status(200).json(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
});

// @route   GET api/profile
// @desc    Get all users profile
// @access  Public

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    return res.status(200).json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user id
// @access  Public

router.get("/user/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const profile = await Profile.findOne({ user: user_id }).populate("user", [
      "name",
      "avatar",
    ]);
    if (!profile)
      return res.status(404).json({
        errors: { message: "Profile not found" },
      });

    return res.status(200).json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId")
      return res.status(404).json({
        errors: { message: "Profile not found" },
      });
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/profile/user/:user_id
// @desc    Delete Profile & user & posts
// @access  Private

router.delete("/", auth, async (req, res) => {
  try {
    const { _id } = req.user;
    // Remove user posts
    await Post.deleteMany({ user: _id });

    // Remove the profile
    await Profile.findOneAndRemove({ user: _id });

    // Remove the User
    await User.findOneAndRemove({ _id: _id });

    return res.status(200).json({ message: "User has been deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/profile/experience
// @desc    Add profile experience
// @access  Private
router.put("/experience", auth, async (req, res) => {
  const { body } = req;
  const { error } = validateProfileExperience(body);
  if (error) return res.status(400).json(errorsMapsToMessages(error));

  // Redefine the body
  const experience = mapFieldsToExperience(body);

  try {
    // check if the profile exists
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile)
      return res.status(404).json({
        errors: { message: "The profile attached to the user not found" },
      });

    // if profile exists
    profile.experience.unshift(experience);
    await profile.save();

    res.status(200).json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/profile/experience/exp_id
// @desc    Delete a user experience from profile
// @access  Private

router.delete("/experience/:exp_id", auth, async (req, res) => {
  const { exp_id } = req.params;
  try {
    // Get the user profile
    const profile = await Profile.findOne({ user: req.user._id });

    // Find the experience to remove
    const removeIndex = profile.experience
      .map((item) => item._id)
      .indexOf(exp_id);

    // Remove it
    profile.experience.splice(removeIndex, 1);

    await profile.save();

    return res.status(200).json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/profile/education
// @desc    Add profile education
// @access  Private
router.put("/education", auth, async (req, res) => {
  const { body } = req;
  const { error } = validateProfileEducation(body);
  if (error) return res.status(400).json(errorsMapsToMessages(error));

  // Redefine the body
  const education = mapFieldsToEducation(body);

  try {
    // check if the profile exists
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile)
      return res.status(404).json({
        errors: { message: "The profile attached to the user not found" },
      });

    // if profile exists
    profile.education.unshift(education);
    await profile.save();

    res.status(200).json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/profile/education/edu_id
// @desc    Delete a user education from profile
// @access  Private

router.delete("/education/:edu_id", auth, async (req, res) => {
  const { edu_id } = req.params;
  try {
    // Get the user profile
    const profile = await Profile.findOne({ user: req.user._id });

    // Find the education to remove
    const removeIndex = profile.education
      .map((item) => item._id)
      .indexOf(edu_id);

    // Remove it
    profile.education.splice(removeIndex, 1);

    await profile.save();

    return res.status(200).json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/profile/github/:username
// @desc    Get a github profile
// @access  Public
router.get("/github/:username", async (req, res) => {
  try {
    const { username } = req.params;

    // send get request to github
    const githubProfile = await getGithubProfile(username);
    if (githubProfile.statusCode !== 200)
      return res
        .status(404)
        .json({ errors: { message: "No Github profile found" } });

    return res.json(JSON.parse(githubProfile.body));
    // return res.status(200).json(githubProfile);
  } catch (err) {
    console.log(err.massage);
    return res.status(500).send("Server Error");
  }
});
module.exports = router;
