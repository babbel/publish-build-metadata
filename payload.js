const github = require('@actions/github');
const {commitDatetime, commitMessage} = require('./git');

const ONE_WEEK = 60 * 60 * 24 * 7;

function generateTTL() {
  return Math.floor(Date.now() / 1000) + ONE_WEEK;
}

function normalizeSlices(rawSlices) {
  if (typeof rawSlices == 'string') {
    return [rawSlices.trim()];
  }

  if (rawSlices instanceof Array) {
    return rawSlices.map((slice) => slice.trim());
  }

  return [];
}

async function generatePayload(rawSlices) {
  const {owner, repo} = github.context.repo;
  const branch = github.context.ref.trim().replace('refs/heads/', '');
  const commitSha = github.context.sha;

  return {
    repository: `${owner}/${repo}`,
    commitSha: commitSha,
    commitBranch: branch,
    commitDatetime: await commitDatetime(commitSha),
    commitMessage: await commitMessage(commitSha),
    slices: normalizeSlices(rawSlices),
    ttl: generateTTL(),
  };
}

module.exports = generatePayload;
