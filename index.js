const core = require('@actions/core');

async function run() {
  try {
    core.info(`Publishing build metadata ...`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
