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

function normalizeBranch(customBranch) {
  if (customBranch !== null) {
    return customBranch;
  }

  const [, , ...branch] = github.context.ref.trim().split('/');

  return branch.join('/');
}

async function generatePayload(rawSlices, customSha = null, customBranch = null) {
  const {owner, repo} = github.context.repo;
  const commitSha = customSha || github.context.sha;

  return {
    repository: `${owner}/${repo}`,
    commit_sha: commitSha,
    commit_branch: normalizeBranch(customBranch),
    commit_datetime: await commitDatetime(commitSha),
    commit_message: await commitMessage(commitSha),
    slices: normalizeSlices(rawSlices),
    ttl: generateTTL(),
  };
}

module.exports = generatePayload;
