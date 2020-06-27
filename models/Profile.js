const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const _ = require("lodash");

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  company: {
    type: String,
  },
  website: {
    type: String,
  },
  location: {
    type: String,
  },
  status: {
    type: String,
    required: true,
  },
  skills: {
    type: [String],
    required: true,
  },
  bio: {
    type: String,
  },
  githubusername: {
    type: String,
  },
  experience: [
    {
      title: {
        type: String,
        required: true,
      },
      company: {
        type: String,
        required: true,
      },
      location: {
        type: String,
      },
      from: {
        type: Date,
        required: true,
      },
      to: {
        type: Date,
      },
      current: {
        type: Boolean,
        required: false,
      },
      description: {
        type: String,
      },
    },
  ],
  education: [
    {
      school: {
        type: String,
        required: true,
      },
      degree: {
        type: String,
        required: true,
      },
      fieldofstudy: {
        type: String,
        required: true,
      },
      from: {
        type: Date,
        required: true,
      },
      to: {
        type: Date,
      },
      current: {
        type: Boolean,
      },
      description: {
        type: String,
      },
    },
  ],
  social: {
    youtube: {
      type: String,
    },
    twitter: {
      type: String,
    },
    facebook: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    instagram: {
      type: String,
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Profile = mongoose.model("profile", ProfileSchema);

const mapFieldsToProfile = (body) => {
  // Build profile object
  let profile = {};

  // Get profile fields
  let profileFields = _.pick(body, [
    "company",
    "website",
    "location",
    "bio",
    "status",
    "skills",
    "githubusername",
    "youtube",
    "facebook",
    "twitter",
    "instagram",
    "linkedin",
  ]);

  if (body.skills)
    profileFields.skills = body.skills.split(",").map((skill) => skill.trim());

  //Construct the profile
  profile = _.pick(profileFields, [
    "company",
    "website",
    "location",
    "bio",
    "status",
    "skills",
    "githubusername",
  ]);
  profile.social = _.pick(profileFields, [
    "youtube",
    "facebook",
    "twitter",
    "instagram",
    "linkedin",
  ]);

  return profile;
};

const mapFieldsToExperience = (body) => {
  // Get profile experience fields
  let experience = _.pick(body, [
    "title",
    "company",
    "from",
    "location",
    "to",
    "current",
    "description",
  ]);
  return experience;
};

const mapFieldsToEducation = (body) => {
  // Get profile education fields
  let education = _.pick(body, [
    "school",
    "degree",
    "fieldofstudy",
    "from",
    "to",
    "current",
    "description",
  ]);
  return education;
};

// User validator
function validateProfile(profile) {
  const schema = Joi.object({
    status: Joi.string().required(),
    skills: Joi.string().required(),
    company: Joi.string().allow(""),
    website: Joi.string().allow(""),
    location: Joi.string().allow(""),
    bio: Joi.string().allow(""),
    githubusername: Joi.string().allow(""),
    youtube: Joi.string().allow(""),
    facebook: Joi.string().allow(""),
    instagram: Joi.string().allow(""),
    linkedin: Joi.string().allow(""),
    twitter: Joi.string().allow(""),
    linkedin: Joi.string().allow(""),
  });

  return schema.validate(profile, { abortEarly: false });
}

// User Experience Validator
function validateProfileExperience(experience) {
  const schema = Joi.object({
    title: Joi.string().required(),
    company: Joi.string().required(),
    from: Joi.date().required(),
    location: Joi.string().allow(""),
    to: Joi.date().allow(""),
    current: Joi.bool().allow(""),
    description: Joi.string().allow(""),
  });

  return schema.validate(experience, { abortEarly: false });
}

// User Experience Validator
function validateProfileEducation(education) {
  const schema = Joi.object({
    school: Joi.string().required(),
    degree: Joi.string().required(),
    fieldofstudy: Joi.string(),
    from: Joi.date().required(),
    to: Joi.date().allow(""),
    current: Joi.bool().allow(""),
    description: Joi.string().allow(""),
  });

  return schema.validate(education, { abortEarly: false });
}

module.exports = {
  Profile,
  validateProfile,
  validateProfileExperience,
  validateProfileEducation,
  mapFieldsToProfile,
  mapFieldsToExperience,
  mapFieldsToEducation,
};
