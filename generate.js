const github = require('@actions/github');
const {commitDatetime, commitMessage} = require('./git');

const ONE_WEEK = 60 * 60 * 24 * 7;

function generateTTL() {
  return Math.floor(Date.now() / 1000) + ONE_WEEK;
}

function normalizeSlices(rawSlices) {
  if (typeof rawSlices !== 'string' || rawSlices.trim() === '') {
    return [];
  }

  return rawSlices
    .split(",")
    .map(x => x.trim())
    .filter(x => x !== '');
}

/**
 * Generates a payload containing build metadata.
 * 
 * For pull request events, automatically uses:
 * - PR head commit SHA instead of merge commit SHA
 * - PR source branch name instead of target branch
 * 
 * @param {string|null} rawSlices - Comma-separated list of slice names
 * @param {string|null} customSha - Optional custom commit SHA to override default behavior
 * @param {string|null} customBranch - Optional custom branch name to override default behavior
 * @returns {Promise<Object>} Payload object containing build metadata
 */
async function generatePayload(rawSlices, customSha = null, customBranch = null) {
  const {owner, repo} = github.context.repo;
  
  // If custom values are provided, use them
  // Otherwise, handle pull_request events differently than other events
  let commitSha, branch;
  
  if (customSha) {
    commitSha = customSha;
  } else if (github.context.eventName === 'pull_request') {
    commitSha = github.context.payload.pull_request.head.sha;
  } else {
    commitSha = github.context.sha;
  }

  if (customBranch) {
    branch = customBranch;
  } else if (github.context.eventName === 'pull_request') {
    branch = github.context.payload.pull_request.head.ref;
  } else {
    branch = github.context.ref.trim().replace('refs/heads/', '');
  }

  return {
    repository: `${owner}/${repo}`,
    commit_sha: commitSha,
    commit_branch: branch,
    commit_datetime: await commitDatetime(commitSha),
    commit_message: await commitMessage(commitSha),
    slices: normalizeSlices(rawSlices),
    ttl: generateTTL(),
  };
}

module.exports = generatePayload;
