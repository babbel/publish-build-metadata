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

async function generatePayload(rawSlices, customSha = null, customBranch = null, customCommitMessageSha = null) {
  const {owner, repo} = github.context.repo;
  const branch = (customBranch || github.context.ref).trim().replace('refs/heads/', '');
  const commitSha = customSha || github.context.sha;
  const commitMessageSha = customCommitMessageSha || commitSha;

  return {
    repository: `${owner}/${repo}`,
    commit_sha: commitSha,
    commit_branch: branch,
    commit_datetime: await commitDatetime(commitMessageSha),
    commit_message: await commitMessage(commitMessageSha),
    slices: normalizeSlices(rawSlices),
    ttl: generateTTL(),
  };
}

module.exports = generatePayload;
