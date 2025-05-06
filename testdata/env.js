const commitSha = '890befeef37b52a4d97c6f6d29fc836ec85308c4';

function setupEnv() {
  process.env.GITHUB_REPOSITORY = 'babbel/publish-build-metadata';
  process.env.GITHUB_REF = 'refs/heads/main';
  process.env.GITHUB_SHA = commitSha;

  process.env.REPOSITORY_PATH = `${process.cwd()}/testdata/dummy_project`;
}

function setupPullRequestEnv() {
  process.env.GITHUB_EVENT_NAME = 'pull_request';
  process.env.GITHUB_EVENT_PATH = `${process.cwd()}/testdata/payloads/event.json`;
  process.env.GITHUB_REF = 'refs/pull/1/merge'; // this is the merge commit branch, not the source branch
  process.env.GITHUB_SHA = commitSha; // this is the merge commit sha, not the source branch's head commit sha
}

module.exports = {
  testSha: commitSha,
  testDatetime: '2019-12-17 15:29:36 +0100',
  testMessage: 'Use header in README (890befe)',
  setupEnv: setupEnv,
  setupPullRequestEnv: setupPullRequestEnv,
}
