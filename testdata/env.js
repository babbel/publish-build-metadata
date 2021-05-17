const commitSha = '890befeef37b52a4d97c6f6d29fc836ec85308c4';

function setupEnv() {
  process.env.GITHUB_REPOSITORY = 'babbel/publish-build-metadata';
  process.env.GITHUB_REF = 'refs/heads/main';
  process.env.GITHUB_SHA = commitSha;

  process.env.REPOSITORY_PATH = `${process.cwd()}/testdata/dummy_project`;
}

module.exports = {
  testSha: commitSha,
  testDatetime: '2019-12-17 15:29:36 +0100',
  testMessage: 'Use header in README (890befe)',
  setupEnv: setupEnv,
}
