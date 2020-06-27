const config = require("config");
const request = require("request");
const util = require("util");

const { githubClientId, githubSecret } = config.get("github");

const getGithubProfile = async (username) => {
  const options = {
    uri: `https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${githubClientId}&client_secret=${githubSecret}`,
    method: "GET",
    headers: { "user-agent": "node.js" },
  };
  const getRequest = util.promisify(request);
  const response = await getRequest(options);
  return response;
};

module.exports = {
  getGithubProfile,
};
