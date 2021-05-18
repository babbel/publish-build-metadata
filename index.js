const core = require('@actions/core');
const generatePayload = require('./generate');
const publishPayload = require('./publish');

async function run() {
  try {
    core.info('Publishing build metadata ...');

    const payload = await generatePayload(core.getInput('slices'));

    await publishPayload(
      core.getInput('access_key_id'),
      core.getInput('secret_access_key'),
      core.getInput('meta_table_arn'),
      payload
    );
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
