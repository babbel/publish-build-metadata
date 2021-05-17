const exec = require('@actions/exec');

async function commitDatetime(commitSha) {
  return commitLog(commitSha, '%ci');
}

async function commitMessage(commitSha) {
  return commitLog(commitSha, '%s (%h)%n%b');
}

async function commitLog(commitSha, format) {
  let log = '';
  let options = {
    failOnStdErr: true,
    silent: process.env['DEBUG'] !== 'true',
    listeners: {
      stdout: (data) => {
        log += data.toString();
      },
    },
  };

  await exec.exec('git', ['show', `--format=${format}`, '--no-patch', commitSha], options);

  return log.trim();
}

module.exports = {
  commitDatetime,
  commitMessage,
}
